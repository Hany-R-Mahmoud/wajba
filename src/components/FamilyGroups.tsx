import { useEffect, useState } from 'react';
import { authClient } from '../auth/client';
import { parseFamilyPlan, referencedFamilyPlan } from '../utils/family';
import type { FamilyGroup, FamilyMember, FamilyPlan } from '../utils/family';
import type { Language, Recipe, WeeklyPlan } from '../types';

export const pendingInviteKey = 'wajba_pending_invite';
export function readInvite(): string {
  const code = new URLSearchParams(window.location.hash.slice(1)).get('join');
  if (code && /^[A-HJ-NP-Z2-9]{10}$/i.test(code)) {
    sessionStorage.setItem(pendingInviteKey, code.toUpperCase());
    history.replaceState(null, '', window.location.pathname + window.location.search);
  }
  return sessionStorage.getItem(pendingInviteKey) ?? '';
}

type Props = { language: Language; plan: WeeklyPlan; customRecipes: Recipe[]; onApply: (plan: FamilyPlan) => void };
type Details = { group: FamilyGroup; members: FamilyMember[]; invite: { invite_code: string | null; invite_expires_at: string } | null };
export function FamilyGroups(props: Props) {
  return authClient ? <ConnectedGroups {...props} /> : null;
}

function ConnectedGroups({ language, plan, customRecipes, onApply }: Props) {
  const { data: session, isPending } = authClient!.useSession();
  const ar = language === 'ar';
  const t = (en: string, arabic: string) => ar ? arabic : en;
  const [code, setCode] = useState(readInvite);
  const [name, setName] = useState('');
  const [groups, setGroups] = useState<FamilyGroup[]>([]);
  const [selected, setSelected] = useState('');
  const [details, setDetails] = useState<Details | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [refresh, setRefresh] = useState(0);
  const userId = session?.user.id;
  async function request(body?: Record<string, unknown>, id?: string) {
    const current = await authClient!.getSession();
    const token = current.data?.session?.token;
    if (current.error || !token) throw new Error(t('Sign in required', 'يلزم تسجيل الدخول'));
    const response = await fetch(`/api/groups${id ? `?id=${encodeURIComponent(id)}` : ''}`, {
      method: body ? 'POST' : 'GET', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      ...(body ? { body: JSON.stringify(body) } : {}),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(response.status === 409
      ? t('The shared plan changed. Refresh before publishing again.', 'تغير الجدول المشترك. حدّثه قبل النشر مرة أخرى.')
      : response.status === 429 ? t('Too many attempts. Try in 10 minutes.', 'محاولات كثيرة. حاول بعد ١٠ دقائق.')
      : t('Request failed. Check membership or invitation and try again.', 'تعذر الطلب. تحقق من العضوية أو الدعوة وحاول مجدداً.'));
    return result;
  }
  useEffect(() => {
    setDetails(null);
    if (!userId) { setGroups([]); return; }
    let active = true;
    let running = false;
    const load = async () => {
      if (running || document.hidden) return;
      running = true;
      try {
        const list = await request();
        const detail = selected ? await request(undefined, selected) : null;
        if (active) { setGroups(list.groups); setDetails(detail); }
      } catch (error) { if (active) { setDetails(null); setMessage((error as Error).message); } }
      finally { running = false; }
    };
    void load();
    const timer = window.setInterval(load, 60_000);
    document.addEventListener('visibilitychange', load);
    return () => { active = false; clearInterval(timer); document.removeEventListener('visibilitychange', load); };
  }, [userId, selected, refresh, language]);

  async function act(action: string, extra: Record<string, unknown> = {}) {
    setBusy(true); setMessage('');
    try {
      const result = await request({ action, id: selected, ...extra });
      if (action === 'create' || action === 'join') {
        setSelected(result.id);
        if (action === 'join') { sessionStorage.removeItem(pendingInviteKey); setCode(''); }
        setName('');
      }
      if (action === 'leave') setSelected('');
      setRefresh(value => value + 1);
      setMessage(t('Done.', 'تم.'));
    } catch (error) { setMessage((error as Error).message); }
    finally { setBusy(false); }
  }
  const button = 'rounded-xl border border-amber-300 px-3 py-2 text-xs font-bold disabled:opacity-50 dark:border-stone-600';
  const input = 'min-w-0 flex-1 rounded-xl border border-stone-300 bg-white p-2 text-sm dark:bg-stone-900 dark:border-stone-600';
  const invite = details?.invite?.invite_code;
  const inviteUrl = invite ? `${window.location.origin}/dashboard#join=${invite}` : '';
  return <section className="space-y-3 rounded-2xl border border-amber-300 bg-amber-50/60 p-4 dark:bg-stone-800" aria-label={t('Connected family groups', 'مجموعات العائلة المتصلة')}>
    <h3 className="font-bold">{t('Connected family groups', 'مجموعات العائلة المتصلة')}</h3>
    <p className="text-xs">{t('Members stay connected. Publish your week, then others can apply it. Local changes are never uploaded automatically.', 'تظل العضوية متصلة. انشر أسبوعك ليطبقه الآخرون. لا تُرفع التغييرات المحلية تلقائياً.')}</p>
    {isPending ? <p role="status">{t('Loading account…', 'جارٍ تحميل الحساب…')}</p> : !session?.user ? <button className={button} disabled={busy} onClick={async () => {
      setBusy(true);
      try {
        if (code) sessionStorage.setItem(pendingInviteKey, code);
        const result = await authClient!.signIn.social({ provider: 'google', callbackURL: `${window.location.origin}/dashboard` });
        if (result.error) throw result.error;
      } catch { setMessage(t('Sign-in failed. Please try again.', 'تعذر تسجيل الدخول. حاول مجدداً.')); setBusy(false); }
    }}>{t('Sign in with Google to create or join', 'سجل الدخول عبر Google للإنشاء أو الانضمام')}</button> : <>
      <form className="flex gap-2" onSubmit={e => { e.preventDefault(); void act('create', { name }); }}>
        <input aria-label={t('Group name', 'اسم المجموعة')} className={input} maxLength={80} required value={name} onChange={e => setName(e.target.value)} placeholder={t('Family name', 'اسم العائلة')} />
        <button className={button} disabled={busy || !name.trim()}>{t('Create', 'إنشاء')}</button>
      </form>
      <form className="flex gap-2" onSubmit={e => { e.preventDefault(); void act('join', { code }); }}>
        <input aria-label={t('Invitation code', 'رمز الدعوة')} className={input} required value={code} onChange={e => setCode(e.target.value.toUpperCase())} placeholder={t('10-character code', 'رمز من ١٠ أحرف')} />
        <button className={button} disabled={busy || !code.trim()}>{t('Join', 'انضمام')}</button>
      </form>
      <label className="block text-sm">{t('Your groups', 'مجموعاتك')}
        <select className={`${input} mt-1 w-full`} value={selected} disabled={busy} onChange={e => { setSelected(e.target.value); setMessage(''); }}>
          <option value="">{t('Select a group', 'اختر مجموعة')}</option>
          {groups.map(group => <option key={group.id} value={group.id}>{group.name} ({group.member_count})</option>)}
        </select>
      </label>
      <button className={button} disabled={busy} onClick={() => setRefresh(value => value + 1)}>{t('Refresh shared plans', 'تحديث الجداول المشتركة')}</button>
      {details && <div className="space-y-3 border-t border-amber-200 pt-3">
        <p className="text-sm font-semibold">{details.group.name} · {t('Version', 'الإصدار')} {details.group.revision}</p>
        <div className="flex flex-wrap gap-2">
          <button className={button} disabled={busy} onClick={() => {
            if (window.confirm(t('Replace the group’s shared plan with your current week? Members can see its notes and referenced custom recipes.', 'استبدال جدول المجموعة بأسبوعك الحالي؟ سيرى الأعضاء الملاحظات والوصفات الخاصة المستخدمة.'))) void act('publish', { revision: details.group.revision, plan: referencedFamilyPlan(plan, customRecipes) });
          }}>{t('Publish my week', 'نشر أسبوعي')}</button>
          <button className={button} disabled={busy || !details.group.plan} onClick={() => {
            const parsed = parseFamilyPlan(details.group.plan);
            if (!parsed) { setMessage(t('Invalid shared plan.', 'الجدول المشترك غير صالح.')); return; }
            if (window.confirm(t('Replace this device’s week with the shared plan? Your existing recipes are kept. Export a backup first if needed.', 'استبدال أسبوع هذا الجهاز بالجدول المشترك؟ ستبقى وصفاتك الحالية. صدّر نسخة احتياطية أولاً عند الحاجة.'))) {
              try { onApply(parsed); setMessage(t('Shared week applied.', 'تم تطبيق الأسبوع المشترك.')); }
              catch { setMessage(t('Unable to save. Check device storage.', 'تعذر الحفظ. تحقق من مساحة الجهاز.')); }
            }
          }}>{t('Apply shared week', 'تطبيق الأسبوع المشترك')}</button>
        </div>
        <ul className="space-y-2 text-sm">{details.members.map(member => <li className="flex items-center justify-between gap-2" key={member.user_id}>
          <span>{member.name} {member.is_owner && t('(owner)', '(المالك)')}</span>
          {details.group.is_owner && !member.is_owner && <button className={button} disabled={busy} onClick={() => {
            if (window.confirm(t('Remove this member and revoke the invitation? They cannot rejoin this group.', 'إزالة العضو وإلغاء الدعوة؟ لن يتمكن من الانضمام مجدداً لهذه المجموعة.'))) void act('remove', { userId: member.user_id });
          }}>{t('Remove', 'إزالة')}</button>}
        </li>)}</ul>
        {details.group.is_owner ? <>
          <p className="text-xs">{t('Invitations expire after 30 days. Rotating or revoking keeps current members connected.', 'تنتهي الدعوات بعد ٣٠ يوماً. تغيير الدعوة أو إلغاؤها لا يفصل الأعضاء الحاليين.')}</p>
          {invite && <>
            <p className="break-all font-mono text-sm" dir="ltr">{invite}</p>
            <input aria-label={t('Invitation URL', 'رابط الدعوة')} className={`${input} w-full`} readOnly value={inviteUrl} dir="ltr" />
            <p className="text-xs">{t('Expires', 'تنتهي')}: {new Date(details.invite!.invite_expires_at).toLocaleDateString(ar ? 'ar' : 'en')}</p>
            <button className={button} disabled={busy} onClick={async () => {
              try { await navigator.clipboard.writeText(inviteUrl); setMessage(t('Invitation copied.', 'تم نسخ الدعوة.')); }
              catch { setMessage(t('Select and copy the invitation URL.', 'حدد رابط الدعوة وانسخه.')); }
            }}>{t('Copy invitation URL', 'نسخ رابط الدعوة')}</button>
          </>}
          <div className="flex flex-wrap gap-2">
            <button className={button} disabled={busy} onClick={() => { if (window.confirm(t('Create a new invitation? The old code will stop working.', 'إنشاء دعوة جديدة؟ سيتوقف الرمز القديم.'))) void act('rotate'); }}>{t('New invitation', 'دعوة جديدة')}</button>
            <button className={button} disabled={busy || !invite} onClick={() => { if (window.confirm(t('Revoke this invitation?', 'إلغاء هذه الدعوة؟'))) void act('revoke'); }}>{t('Revoke invitation', 'إلغاء الدعوة')}</button>
          </div>
        </> : <button className={button} disabled={busy} onClick={() => { if (window.confirm(t('Leave this group?', 'مغادرة المجموعة؟'))) void act('leave'); }}>{t('Leave group', 'مغادرة المجموعة')}</button>}
      </div>}
    </>}
    {message && <p className="text-sm" role="status">{message}</p>}
  </section>;
}
