import { Head } from '@inertiajs/react';
import { ChevronDownIcon, ChevronRight, ChevronsDownIcon, Loader, TrendingDown, TrendingUp } from 'lucide-react';
import { useState } from 'react';
import ComparisonDiffBadge from '@/components/custom/ComparisonDiffBadge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { userGuide } from '@/routes';

// ─── Language ─────────────────────────────────────────────────────────────────

type Lang = 'en' | 'ar';

const STORAGE_KEY = 'dashboard-lang';

function useLanguage() {
    const [lang, setLang] = useState<Lang>(() => {
        return (localStorage.getItem(STORAGE_KEY) as Lang) ?? 'en';
    });

    const toggleLang = () => {
        const next: Lang = lang === 'en' ? 'ar' : 'en';
        localStorage.setItem(STORAGE_KEY, next);
        setLang(next);
    };

    return { lang, toggleLang };
}

// ─── Translation types ─────────────────────────────────────────────────────────

type LocaleText = { label: string; description: string };

type GuideItemDef = {
    id: string;
    en: LocaleText;
    ar: LocaleText;
    example?: React.ReactNode;
};

type GuideSectionDef = {
    id: string;
    en: { title: string };
    ar: { title: string };
    items: GuideItemDef[];
};

// ─── Content ──────────────────────────────────────────────────────────────────

const SECTIONS: GuideSectionDef[] = [
    {
        id: 'global',
        en: { title: 'Global Indicators' },
        ar: { title: 'المؤشرات العامة' },
        items: [
            {
                id: 'diff-badge',
                en: {
                    label: 'Difference Badge',
                    description:
                        'A colored pill that appears in Difference columns across dashboards. A red badge means current month-to-date is below what was reached on this same calendar day during the best month on record; a green badge means it exceeds it. The number shown is Current minus Highest. A blank badge means the values are equal.',
                },
                ar: {
                    label: 'شارة الفرق',
                    description: 'علامة ملونة تظهر في أعمدة الفرق عبر لوحات المعلومات. الشارة الحمراء تعني أن دخل الشهر الحالي حتى اليوم أقل مما تم تحقيقه في نفس اليوم من أفضل شهر مسجّل؛ والشارة الخضراء تعني أنه يتجاوزه. الرقم المعروض هو الحالي ناقص الأعلى. الشارة الفارغة تعني أن القيم متساوية.'
                },
                example: (
                    <div className="flex items-center gap-2">
                        <ComparisonDiffBadge value={0} />
                        <ComparisonDiffBadge value={500} />
                        <ComparisonDiffBadge value={-1200} />
                    </div>
                ),
            },
            {
                id: 'trend-arrow',
                en: {
                    label: 'Trend Arrow (table column headers)',
                    description:
                        "Appears next to column names in the Stats table. A green up-arrow means today's value is higher than yesterday's. A red down-arrow means today is lower. No arrow means no difference or data is unavailable.",
                },
                ar: {
                    label: 'سهم الاتجاه (رؤوس أعمدة الجدول)',
                    description: 'يظهر بجوار أسماء الأعمدة في جدول الحجوزات. السهم الأخضر المتجه للأعلى يعني أن قيمة اليوم أعلى من قيمة الأمس. السهم الأحمر المتجه للأسفل يعني أن قيمة اليوم أقل. عدم وجود سهم يعني عدم وجود فرق أو أن البيانات غير متوفرة.'
                },
                example: (
                    <div className="flex items-center gap-2">
                        <TrendingUp className="shadow size-5 stroke-3 rounded-full p-0.5 bg-success border border-white text-white" />
                        <TrendingDown className="shadow size-5 stroke-3 rounded-full p-0.5 bg-destructive border border-white text-white" />
                    </div>
                ),
            },
            {
                id: 'bg-refresh',
                en: {
                    label: 'Background Refresh Indicator',
                    description:
                        'A spinning icon that appears in the bottom-right corner when the dashboard is silently re-fetching data. It only shows while a refresh is in progress after data has already loaded — no page reload is needed.',
                },
                ar: {
                    label: 'مؤشر التحديث في الخلفية',
                    description: 'أيقونة دوارة تظهر في الزاوية السفلية اليمنى عندما تقوم لوحة التحكم بإعادة جلب البيانات في صمت. تظهر فقط أثناء عملية التحديث بعد تحميل البيانات بالفعل — لا حاجة لإعادة تحميل الصفحة.'
                },
                example: (
                    <div className="p-2 bg-primary text-secondary rounded-lg">
                        <Loader className="animate-spin size-4" />
                    </div>
                ),
            },
        ],
    },
    {
        id: 'stats',
        en: { title: 'Stats' },
        ar: { title: 'الإحصائيات' },
        items: [
            {
                id: 'target-cards',
                en: {
                    label: 'Target Cards (top of page)',
                    description:
                        'Visible only to users with the targets.view permission. The donut chart shows progress (achieved) vs remaining for the month. The center number is the total monthly target value. The Progress row shows how much has been achieved; Remaining shows how much is left.',
                },
                ar: {
                    label: 'بطاقات الأهداف (أعلى الصفحة)',
                    description: 'تظهر فقط للمستخدمين الذين لديهم صلاحية عرض الأهداف (targets.view). يوضح المخطط الدائري المجوف التقدم (المحقق) مقابل المتبقي لهذا الشهر. الرقم الأوسط هو إجمالي قيمة الهدف الشهري. يوضح صف التقدم المقدار الذي تم تحقيقه؛ ويوضح المتبقي المقدار المتبقي.'
                },
            },
            {
                id: 'periods',
                en: {
                    label: 'Time Period rows',
                    description:
                        'Each row represents a time window: today, yesterday, current month-to-date, and the income reached on this same calendar day during the best month on record.',
                },
                ar: {
                    label: 'صفوف الفترات الزمنية',
                    description: 'يمثل كل صف فترة زمنية: اليوم، الأمس، دخل الشهر الحالي حتى اليوم، والدخل الذي تم تحقيقه في نفس اليوم من أفضل شهر مسجّل.'
                },
            },
            {
                id: 'highest-month',
                en: {
                    label: 'Highest month row',
                    description:
                        'Shows the income reached on this same calendar day during the best month on record — not the full month total. It is a benchmark that may be higher or lower than the current month-to-date row.',
                },
                ar: {
                    label: 'صف أعلى شهر',
                    description: 'يعرض الدخل الذي تم تحقيقه في نفس اليوم من أفضل شهر مسجّل — وليس إجمالي الشهر كاملاً. وهو نقطة مرجعية قد تكون أعلى أو أقل من صف الشهر الحالي حتى اليوم.'
                },
            },
            {
                id: 'percentage-col',
                en: {
                    label: 'Percentage column',
                    description:
                        'For most rows this shows the arrived-to-viewings ratio as a percentage. For the highest_month row it switches to a Difference Badge comparing current month income to what was reached on this same calendar day during the best month on record (which may be higher or lower).',
                },
                ar: {
                    label: 'عمود النسبة المئوية',
                    description: 'بالنسبة لمعظم الصفوف، يعرض هذا نسبة الحضور إلى الحجوزات كنسبة مئوية. أما بالنسبة لصف أعلى شهر (highest_month)، فيتحول إلى شارة فرق تقارن دخل الشهر الحالي بما تم تحقيقه في نفس اليوم من أفضل شهر مسجّل (وقد يكون أعلى أو أقل).'
                },
            },
            {
                id: 'totals-table',
                en: {
                    label: 'Totals Table (bottom of page)',
                    description:
                        'An aggregated total across all businesses that are configured to contribute to the totals. Not every business is included — only those with the stats-totals feature enabled. (Alpha Realty - Beta Realty - Gamma Realty - Delta Realty - Epsilon Realty)',
                },
                ar: {
                    label: 'جدول المجاميع (أسفل الصفحة)',
                    description: 'إجمالي لكل الشركات المجهزة للمساهمة في المجاميع. لا يتم تضمين كل الشركات — فقط تلك التي تم تفعيل ميزة إجمالي الحجوزات فيها. (عيادة ألفا - عيادة بيتا - عيادة غاما - عيادة دلتا - عيادة إبسيلون)'
                },
            },
            {
                id: 'sub-offices',
                en: {
                    label: 'Sub-offices (expandable)',
                    description:
                        'Some agencies have sub-office rows hidden below them. Click the chevron icon that appears under a business table to expand and view its sub-offices broken down by the same viewing metrics.',
                },
                ar: {
                    label: 'المكاتب الفرعية (قابلة للتوسيع)',
                    description: 'تحتوي بعض الوكالات على صفوف لمكاتب فرعية مخفية أسفلها. انقر على أيقونة السهم التي تظهر أسفل جدول الوكالة لتوسيعه وعرض مكاتبها الفرعية مقسمة حسب نفس مقاييس المشاهدات.'
                },
                example: (
                    <Button variant="link">
                        <ChevronsDownIcon className="size-5 bg-foreground text-background rounded-full p-0.5" />
                    </Button>
                ),
            },
            {
                id: 'tables-order',
                en: {
                    label: 'Tables Order',
                    description:
                        'The businesses are sorted by today\'s income in descending order; highest sits at the top. However, property-management businesses are not included in the sorting. (Zeta Property Management)',
                },
                ar: {
                    label: 'ترتيب الجداول',
                    description: 'يتم فرز الشركات حسب دخل اليوم بترتيب تنازلي؛ حيث يقع الأعلى في القمة. ومع ذلك، لا يتم تضمين الشركات غير العيادات في هذا الفرز. (زيتا للمكملات)'
                },
            },
        ],
    },
    {
        id: 'property-types',
        en: { title: 'Property Types' },
        ar: { title: 'أنواع العقارات' },
        items: [
            {
                id: 'summary-cards',
                en: {
                    label: 'Summary Cards (top)',
                    description:
                        'One card per agency showing aggregated totals across all property types: month-to-date new leads, current month-to-date income, the best-month same-day income benchmark, and a Difference Badge comparing Current to Highest.',
                },
                ar: {
                    label: 'بطاقات الملخص (في الأعلى)',
                    description: 'بطاقة واحدة لكل وكالة تعرض المجاميع الكلية عبر جميع أنواع العقارات: عملاء محتملون جدد حتى اليوم، دخل الشهر الحالي حتى اليوم، معيار دخل أفضل شهر في نفس اليوم، وشارة فرق تقارن الحالي بالأعلى.'
                },
                example: <ComparisonDiffBadge value={-450} />,
            },
            {
                id: 'new-col',
                en: {
                    label: 'New column',
                    description:
                        'The number of new leads registered under this property type in the current period.',
                },
                ar: {
                    label: 'عمود جديد',
                    description: 'عدد العملاء المحتملين الجدد المسجلين تحت نوع العقار هذا في الفترة الحالية.'
                },
            },
            {
                id: 'grouped-rows',
                en: {
                    label: 'Grouped property type rows',
                    description:
                        'Property types that exist across multiple agencies share a merged cell on the left. Each row within the group represents a different agency offering that property type.',
                },
                ar: {
                    label: 'صفوف أنواع العقارات المجمعة',
                    description: 'أنواع العقارات الموجودة في وكالات متعددة تتشارك في خلية مدمجة على اليسار. كل صف داخل المجموعة يمثل وكالة مختلفة تقدم نوع العقار ذلك.'
                },
            },
        ],
    },
    {
        id: 'agents',
        en: { title: 'Agents' },
        ar: { title: 'الوكلاء' },
        items: [
            {
                id: 'current-highest-cols',
                en: {
                    label: 'Current / Highest / Difference columns',
                    description:
                        'Current shows month-to-date income for this agent at this agency. Highest shows what was reached on this same calendar day during the best month on record (which may be higher or lower). Difference is Current minus Highest.',
                },
                ar: {
                    label: 'أعمدة الحالي / الأعلى / الفرق',
                    description: 'يعرض الحالي دخل الشهر حتى اليوم لهذا الوكيل في هذه الوكالة. يعرض الأعلى ما تم تحقيقه في نفس اليوم من أفضل شهر مسجّل (وقد يكون أعلى أو أقل). الفرق هو الحالي ناقص الأعلى.'
                },
            },
            {
                id: 'filters',
                en: {
                    label: 'Agency / Agent / Property Type filters',
                    description:
                        'The three dropdowns at the top filter the table independently. Selecting an Agency resets the Agent filter since agents are scoped to agencies. Property type options automatically update to only show types available under the selected agency and agent combination.',
                },
                ar: {
                    label: 'فلاتر الوكالة / الوكيل / نوع العقار',
                    description: 'القوائم المنسدلة الثلاث في الأعلى تقوم بتصفية الجدول بشكل مستقل. اختيار الوكالة يعيد ضبط فلتر الوكيل لأن الوكلاء مرتبطون بالوكالات. يتم تحديث خيارات أنواع العقارات تلقائياً لعرض الأنواع المتاحة فقط تحت مجموعة الوكالة والوكيل المحددة.'
                },
            },
            {
                id: 'grouped-rows',
                en: {
                    label: 'Grouped agent rows',
                    description:
                        "Agents who work across multiple agencies appear as a single merged cell on the left, with one row per agency beneath them. This avoids repeating the agent's name.",
                },
                ar: {
                    label: 'صفوف الوكلاء المجمعة',
                    description: 'الوكلاء الذين يعملون في وكالات متعددة يظهرون كخلية واحدة مدمجة على اليسار، مع وجود صف واحد لكل وكالة أسفلهم. هذا يتجنب تكرار اسم الوكيل.'
                },
            },
            {
                id: 'agency-agent-count',
                en: {
                    label: 'Agency filter — agent count',
                    description:
                        'In the Agencies dropdown, each option shows a number on the right. That number is how many agents are currently available in that agency.',
                },
                ar: {
                    label: 'فلتر الوكالات — عدد الوكلاء',
                    description: 'في القائمة المنسدلة للوكالات، يظهر رقم على يمين كل خيار. يمثل هذا الرقم عدد الوكلاء المتاحين حالياً في تلك الوكالة.'
                },
                example: (
                    <div className="rounded-lg border px-3 py-2 text-sm w-52">
                        <div className="flex w-full items-center justify-between gap-2">
                            <span className="truncate">Alpha Realty</span>
                            <span className="tabular-nums">24</span>
                        </div>
                    </div>
                ),
            },
            {
                id: 'agent-duplicate-count',
                en: {
                    label: 'Agent filter — agency count',
                    description:
                        'In the Agents dropdown, an agent who works at more than one agency shows a number on the right. That number is how many agencies they appear in. The same count is shown next to their name in every agency group they belong to. Agents in only one agency show no number.',
                },
                ar: {
                    label: 'فلتر الوكلاء — عدد الوكالات',
                    description: 'في القائمة المنسدلة للوكلاء، يظهر رقم على يمين الوكيل الذي يعمل في أكثر من وكالة واحدة. يمثل هذا الرقم عدد الوكالات التي يظهر فيها. يُعرض نفس الرقم بجوار اسمه في كل مجموعة وكالة ينتمي إليها. الوكلاء الموجودون في وكالة واحدة فقط لا يظهر بجانبهم رقم.'
                },
                example: (
                    <div className="rounded-lg border px-3 py-2 text-sm w-44 capitalize">
                        <div className="flex w-full items-center justify-between gap-2">
                            <span className="truncate">Sarah Chen</span>
                            <span className="tabular-nums">3</span>
                        </div>
                    </div>
                ),
            },
        ],
    },
    {
        id: 'deals',
        en: { title: 'Deals' },
        ar: { title: 'الصفقات' },
        items: [
            {
                id: 'pipeline-table',
                en: {
                    label: 'Deal pipeline table',
                    description:
                        'Lists scheduled closings across agencies with client details, listing ID, square footage, inspection time, office branch, property type, assigned agents, and payment columns (price, paid, due).',
                },
                ar: {
                    label: 'جدول مسار الصفقات',
                    description: 'يعرض الإغلاقات المجدولة عبر الوكالات مع تفاصيل العميل، رقم القائمة، المساحة بالقدم المربع، وقت المعاينة، فرع المكتب، نوع العقار، الوكلاء المعينون، وأعمدة الدفع (السعر، المدفوع، المستحق).'
                },
            },
            {
                id: 'deal-filters',
                en: {
                    label: 'Filters and inspection sort',
                    description:
                        'Filter by agency, office, agent, phone, date range, and paid/price/due ranges. Use the Inspection button to sort by inspection time ascending or descending.',
                },
                ar: {
                    label: 'الفلاتر وترتيب المعاينة',
                    description: 'صفِّ حسب الوكالة والمكتب والوكيل والهاتف ونطاق التاريخ ونطاقات المدفوع/السعر/المستحق. استخدم زر المعاينة للترتيب حسب وقت المعاينة تصاعدياً أو تنازلياً.'
                },
            },
        ],
    },
    {
        id: 'sales-teams',
        en: { title: 'Sales Teams' },
        ar: { title: 'فرق المبيعات' },
        items: [
            {
                id: 'routing',
                en: {
                    label: 'Routing & sidebar navigation',
                    description:
                        'The page lives at /sales-teams and requires the sales teams.view permission. The sidebar lists one link per business that has the sales-teams feature enabled: Alpha Realty, Beta Realty, Gamma Realty, Delta Realty, and Epsilon Realty. Visiting /sales-teams without a business name automatically redirects to the first eligible business.',
                },
                ar: {
                    label: 'التوجيه والتنقل في الشريط الجانبي',
                    description: 'تقع الصفحة على /sales-teams وتتطلب صلاحية sales teams.view. يعرض الشريط الجانبي رابطاً واحداً لكل شركة مفعّل فيها ميزة فرق المبيعات: عيادة ألفا، عيادة بيتا، عيادة غاما، عيادة دلتا، وعيادة إبسيلون. زيارة /sales-teams بدون تحديد اسم الشركة يعيد التوجيه تلقائياً إلى أول شركة مؤهلة.'
                },
            },
            {
                id: 'member-subtable',
                en: {
                    label: 'Member sub-table (expandable)',
                    description:
                        'Click a team row or its chevron to expand a nested table of that team\'s members.',
                },
                ar: {
                    label: 'جدول الأعضاء الفرعي (قابل للتوسيع)',
                    description: 'انقر على صف الفريق أو السهم بجانبه لتوسيع جدول متداخل لأعضاء ذلك الفريق.'
                },
                example: (
                    <Button variant="ghost" size="icon" className="size-7">
                        <ChevronRight className="size-4" />
                    </Button>
                ),
            },
            {
                id: 'golden-row',
                en: {
                    label: 'Golden row highlight',
                    description:
                        'In both the team table and the member sub-table, the row with the highest Income is highlighted with a gold gradient background. This marks the top performer for quick comparison. If every income value is zero, no row is highlighted.',
                },
                ar: {
                    label: 'تمييز الصف الذهبي',
                    description: 'في جدول الفرق وجدول الأعضاء الفرعي، يُميَّز الصف ذو أعلى دخل بخلفية متدرجة ذهبية. هذا يحدد أفضل أداء للمقارنة السريعة. إذا كانت جميع قيم الدخل صفراً، لا يُميَّز أي صف.'
                },
                example: (
                    <div className="rounded px-3 py-1.5 text-sm font-medium bg-linear-to-r from-yellow-400 via-amber-500 to-yellow-400 text-black">
                        Top income
                    </div>
                ),
            },
            {
                id: 'sorting',
                en: {
                    label: 'Column sorting',
                    description:
                        'Both the team table and member sub-table start sorted by Income descending (highest first). Click any sortable column header to toggle ascending, descending, or reset.',
                },
                ar: {
                    label: 'فرز الأعمدة',
                    description: 'يبدأ جدول الفرق وجدول الأعضاء الفرعي مرتّبين حسب الدخل تنازلياً (الأعلى أولاً). انقر على رأس أي عمود قابل للفرز للتبديل بين تصاعدي، تنازلي، أو إعادة الضبط.'
                },
            },
        ],
    },
    {
        id: 'roles',
        en: { title: 'Roles & Permissions' },
        ar: { title: 'الأدوار والصلاحيات' },
        items: [
            {
                id: 'passcode',
                en: {
                    label: 'Passcode',
                    description:
                        'A random string of characters is generated when a role is created. It\'s necessary to copy and store immediately after creation because it\'s a one-time visibility.',
                },
                ar: {
                    label: 'رمز المرور',
                    description: 'سلسلة عشوائية من الأحرف يتم إنشاؤها عند إنشاء دور. من الضروري نسخها وحفظها فور إنشائها لأنها تظهر لمرة واحدة فقط.'
                },
            },
        ],
    },
    {
        id: 'activity',
        en: { title: 'Activity Log' },
        ar: { title: 'سجل النشاطات' },
        items: [
            {
                id: 'what-logged',
                en: {
                    label: 'What is logged',
                    description:
                        "Every HTTP request made to the dashboard is recorded: the visitor's name, the route they accessed, their IP address, device, browser, and operating system. Requests made by users with the Super User role are not logged.",
                },
                ar: {
                    label: 'ما يتم تسجيله',
                    description: 'يتم تسجيل كل طلب HTTP يتم إجراؤه إلى لوحة التحكم: اسم الزائر، المسار الذي تم الوصول إليه، عنوان IP الخاص به، الجهاز، المتصفح، ونظام التشغيل. لا يتم تسجيل الطلبات التي يتم إجراؤها بواسطة المستخدمين ذوي دور المستخدم المتميز (Super User).'
                },
            },
            {
                id: 'purpose',
                en: {
                    label: 'Purpose',
                    description:
                        'This page is intended to audit activity and find room for improvement in the application.',
                },
                ar: {
                    label: 'الهدف',
                    description: 'تهدف هذه الصفحة إلى تدقيق النشاط وإيجاد فرص للتحسين في التطبيق.'
                },
            },
        ],
    },
];

const PAGE_TEXT = {
    en: {
        title: 'User Guide',
        description:
            'A guide to understand the application and its features.',
    },
    ar: {
        title: 'دليل المستخدم',
        description: 'دليل لفهم التطبيق وخصائصه.',
    },
} satisfies Record<Lang, { title: string; description: string }>;

// ─── Primitives ───────────────────────────────────────────────────────────────

function GuideSection({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) {
    const [open, setOpen] = useState(true);

    return (
        <Collapsible open={open} onOpenChange={setOpen}>
            <Card className="gap-0 py-0 overflow-hidden">
                <CollapsibleTrigger asChild>
                    <button className="w-full text-left cursor-pointer">
                        <CardHeader className="py-4 px-6">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-base">{title}</CardTitle>
                                <ChevronDownIcon
                                    className={cn(
                                        'size-4 text-muted-foreground transition-transform duration-200',
                                        open && 'rotate-180',
                                    )}
                                />
                            </div>
                        </CardHeader>
                    </button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                    <Separator />
                    <CardContent className="py-0 divide-y">{children}</CardContent>
                </CollapsibleContent>
            </Card>
        </Collapsible>
    );
}

function GuideItem({
    label,
    description,
    example,
}: {
    label: string;
    description: string;
    example?: React.ReactNode;
}) {
    return (
        <div className="flex items-start justify-between gap-6 py-4">
            <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between gap-2 min-w-[100px] flex-wrap">
                    <p className="text-sm font-medium">{label}</p>
                    {example && <div className="shrink-0 py-4 flex items-center gap-2">{example}</div>}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
            </div>
        </div>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function UserGuide() {
    const { lang, toggleLang } = useLanguage();
    const page = PAGE_TEXT[lang];

    return (
        <>
            <Head title="User Guide" />
            <div
                dir={lang === 'ar' ? 'rtl' : 'ltr'}
                className={cn(
                    'flex flex-col gap-4 p-4 max-w-4xl mx-auto w-full',
                    lang === 'ar' && 'font-cairo',
                )}
            >
                <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                        <h1 className="text-2xl font-bold tracking-tight">{page.title}</h1>
                        <p className="text-muted-foreground text-sm">{page.description}</p>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={toggleLang}
                        className={cn(
                            'shrink-0 font-medium tabular-nums',
                            lang === 'en' && 'font-cairo',
                        )}
                    >
                        {lang === 'en' ? 'العربية' : 'English'}
                    </Button>
                </div>

                {SECTIONS.map((section) => (
                    <GuideSection key={section.id} title={section[lang].title}>
                        {section.items.map((item) => (
                            <GuideItem
                                key={item.id}
                                label={item[lang].label}
                                description={item[lang].description}
                                example={item.example}
                            />
                        ))}
                    </GuideSection>
                ))}
            </div>
        </>
    );
}

UserGuide.layout = {
    breadcrumbs: [
        {
            title: 'User Guide',
            href: userGuide(),
        },
    ],
};
