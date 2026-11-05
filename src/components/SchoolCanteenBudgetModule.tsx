import React, { useState, useRef } from 'react';
import {
  Utensils,
  Plus,
  Trash2,
  Printer,
  Download,
  Calculator,
  TrendingUp,
  CheckCircle2,
  Coins,
  Users,
  PackageCheck,
  ShieldCheck,
  CalendarRange,
} from 'lucide-react';
import { OFFICIAL_AUTHOR_SIGNATURE } from '../data/timetableModels';
import { exportElementToPDF, triggerPrintOrPdf } from '../utils/printAndPdf';

export interface DailyMealRecord {
  id: string;
  date: string;
  dayName: string;
  menuMain: string;
  menuSupplement: string;
  registeredBeneficiaries: number;
  actualBeneficiaries: number;
  unitCostDzd: number;
  witnessMealKept: boolean;
  notes: string;
}

export interface CanteenBudgetConfig {
  allocatedBudgetDzd: number;
  defaultUnitCostDzd: number;
  registeredStudentsCount: number;
  municipalityContributionDzd: number;
  stateGrantDzd: number;
  canteenManagerName: string;
  suppliersInfo: string;
}

export interface CanteenBeneficiaryStudent {
  id: string;
  fullName: string;
  levelTitle: string;
  socialCategory: 'معوز' | 'يتيم' | 'بعد المسافة' | 'ذوي الدخل الضعيف';
  guardianName: string;
  healthAllergyNote: string;
}

export interface CanteenStockItem {
  id: string;
  itemName: string;
  category: 'بقوليات وعجائن' | 'لحوم ودواجن' | 'خضر وفواكه' | 'حليب ومشتقاته' | 'مواد بقالة وخبز';
  unit: 'كغ' | 'لتر' | 'علبة' | 'وحدة';
  qtyIn: number;
  qtyConsumed: number;
  expiryDate: string;
  supplierName: string;
}

export interface CanteenHygieneCheck {
  id: string;
  workerName: string;
  role: string;
  medicalCertDate: string;
  medicalStatus: 'صالح للعمل (ملف صحي محين)' | 'قيد التجديد الدوري';
  dailyTask: string;
}

export const INITIAL_CANTEEN_CONFIG: CanteenBudgetConfig = {
  allocatedBudgetDzd: 2450000,
  defaultUnitCostDzd: 95,
  registeredStudentsCount: 185,
  municipalityContributionDzd: 850000,
  stateGrantDzd: 1600000,
  canteenManagerName: 'ع. بن سالم (مسير المطعم)',
  suppliersInfo: 'مؤسسة التموين الغذائي المعتمدة لدى البلدية',
};

export const INITIAL_DAILY_MEALS: DailyMealRecord[] = [
  {
    id: 'm1',
    date: '2026-10-18',
    dayName: 'الأحد',
    menuMain: 'عدس مطبوخ بلحم العجل + سلطة خضراء',
    menuSupplement: 'جبن + تفاح موسمي + خبز',
    registeredBeneficiaries: 185,
    actualBeneficiaries: 178,
    unitCostDzd: 95,
    witnessMealKept: true,
    notes: 'وجبة متوازنة — حفظ الطبق الشاهد لمدة 48 ساعة',
  },
  {
    id: 'm2',
    date: '2026-10-19',
    dayName: 'الاثنين',
    menuMain: 'كسكسي بالخضر والدجاج + لبن معلب',
    menuSupplement: 'موز + خبز',
    registeredBeneficiaries: 185,
    actualBeneficiaries: 182,
    unitCostDzd: 95,
    witnessMealKept: true,
    notes: 'إقبال ممتاز للتلاميذ واحترام معايير النظافة',
  },
  {
    id: 'm3',
    date: '2026-10-20',
    dayName: 'الثلاثاء',
    menuMain: 'فاصولياء بيضاء بصلصة الطماطم واللحم',
    menuSupplement: 'ياغورت طبيعي + برتقال + خبز',
    registeredBeneficiaries: 185,
    actualBeneficiaries: 174,
    unitCostDzd: 95,
    witnessMealKept: true,
    notes: 'توزيع الوجبة قبل الخروج على الساعة 11:15',
  },
  {
    id: 'm4',
    date: '2026-10-21',
    dayName: 'الأربعاء',
    menuMain: 'أرز بالخضر وشرائح الديك الرومي + سلطة',
    menuSupplement: 'جبن طري + إجاص + خبز',
    registeredBeneficiaries: 185,
    actualBeneficiaries: 180,
    unitCostDzd: 95,
    witnessMealKept: true,
    notes: 'مراقبة صلاحية المواد الاستهلاكية بالمخزن',
  },
  {
    id: 'm5',
    date: '2026-10-22',
    dayName: 'الخميس',
    menuMain: 'حمص باللحم المفروم + بطاطا مهروسة بالجبن',
    menuSupplement: 'تحلية حليب + تمر دقلة نور + خبز',
    registeredBeneficiaries: 185,
    actualBeneficiaries: 179,
    unitCostDzd: 95,
    witnessMealKept: true,
    notes: 'تنظيف وتعقيم شامل لقاعة الإطعام والمطبخ',
  },
];

const INITIAL_BENEFICIARIES_LIST: CanteenBeneficiaryStudent[] = [
  { id: 'bs1', fullName: 'بوزيد محمد الأمين', levelTitle: 'السنة الأولى ابتدائي', socialCategory: 'معوز', guardianName: 'بوزيد عبد القادر', healthAllergyNote: 'لا توجد حساسية غذائية' },
  { id: 'bs2', fullName: 'رحماني آية سلسبيل', levelTitle: 'السنة الثانية ابتدائي', socialCategory: 'يتيم', guardianName: 'رحماني فاطمة', healthAllergyNote: 'لا توجد حساسية غذائية' },
  { id: 'bs3', fullName: 'عيساوي عبد الرحمن', levelTitle: 'السنة الثالثة ابتدائي', socialCategory: 'بعد المسافة', guardianName: 'عيساوي لخضر', healthAllergyNote: 'لا توجد حساسية غذائية' },
  { id: 'bs4', fullName: 'عماري مريم البتول', levelTitle: 'السنة الرابعة ابتدائي', socialCategory: 'ذوي الدخل الضعيف', guardianName: 'عماري بلقاسم', healthAllergyNote: 'تجنب الحليب غير المبستر' },
  { id: 'bs5', fullName: 'خليفي ياسين', levelTitle: 'السنة الخامسة ابتدائي', socialCategory: 'معوز', guardianName: 'خليفي المختار', healthAllergyNote: 'لا توجد حساسية غذائية' },
  { id: 'bs6', fullName: 'تومي سارة', levelTitle: 'التربية التحضيرية', socialCategory: 'ذوي الدخل الضعيف', guardianName: 'تومي كمال', healthAllergyNote: 'لا توجد حساسية غذائية' },
];

const INITIAL_STOCK_ITEMS: CanteenStockItem[] = [
  { id: 'st1', itemName: 'عدس وحمص وفاصولياء جافة', category: 'بقوليات وعجائن', unit: 'كغ', qtyIn: 140, qtyConsumed: 85, expiryDate: '2027-06-30', supplierName: 'الديوان الجزائري المهني للحبوب (OAIC)' },
  { id: 'st2', itemName: 'عجائن غذائية وكسكسي وأرز', category: 'بقوليات وعجائن', unit: 'كغ', qtyIn: 160, qtyConsumed: 95, expiryDate: '2027-08-15', supplierName: 'ممون المواد الغذائية العامة' },
  { id: 'st3', itemName: 'لحم عجل طازج ودواجن مراقبة بيطرياً', category: 'لحوم ودواجن', unit: 'كغ', qtyIn: 90, qtyConsumed: 78, expiryDate: 'تموين يومي طازج', supplierName: 'قصابة وممون اللحوم المعتمد' },
  { id: 'st4', itemName: 'خضر وفواكه موسمية طازجة', category: 'خضر وفواكه', unit: 'كغ', qtyIn: 250, qtyConsumed: 210, expiryDate: 'تموين أسبوعي طازج', supplierName: 'ممون الخضر والفواكه البلدي' },
  { id: 'st5', itemName: 'أجبان وياغورت ولبن معلب', category: 'حليب ومشتقاته', unit: 'علبة', qtyIn: 950, qtyConsumed: 760, expiryDate: '2026-12-20', supplierName: 'ملبنة الجنوب المعتمدة' },
  { id: 'st6', itemName: 'زيت المائدة وطماطم مصبرة وتوابل', category: 'مواد بقالة وخبز', unit: 'وحدة', qtyIn: 80, qtyConsumed: 48, expiryDate: '2027-09-01', supplierName: 'ممون المواد الغذائية العامة' },
];

const INITIAL_HYGIENE_WORKERS: CanteenHygieneCheck[] = [
  { id: 'hw1', workerName: 'خديجة بن عيسى', role: 'طباخة رئيسية بالمطعم', medicalCertDate: '2026-09-10', medicalStatus: 'صالح للعمل (ملف صحي محين)', dailyTask: 'تحضير الوجبة الساخنة وحفظ الطبق الشاهد (48 ساعة)' },
  { id: 'hw2', workerName: 'سعاد مرزوقي', role: 'عون مطعم وتوزيع', medicalCertDate: '2026-09-12', medicalStatus: 'صالح للعمل (ملف صحي محين)', dailyTask: 'توزيع الوجبات وتنظيف وتعقيم الأواني والطاولات' },
  { id: 'hw3', workerName: 'عبد المجيد قادري', role: 'عون استلام ومخزن', medicalCertDate: '2026-09-15', medicalStatus: 'صالح للعمل (ملف صحي محين)', dailyTask: 'فحص السلع المستلمة ومراقبة درجة حرارة الثلاجات' },
];

interface SchoolCanteenBudgetModuleProps {
  institution: {
    wilaya: string;
    district: string;
    school: string;
    year: string;
    directorName: string;
  };
  logoUrl: string;
  totalSchoolStudents: number;
  canteenConfig: CanteenBudgetConfig;
  setCanteenConfig: React.Dispatch<React.SetStateAction<CanteenBudgetConfig>>;
  dailyMeals: DailyMealRecord[];
  setDailyMeals: React.Dispatch<React.SetStateAction<DailyMealRecord[]>>;
}

export default function SchoolCanteenBudgetModule({
  institution,
  logoUrl,
  totalSchoolStudents,
  canteenConfig,
  setCanteenConfig,
  dailyMeals,
  setDailyMeals,
}: SchoolCanteenBudgetModuleProps) {
  const [subTab, setSubTab] = useState<'budget_meals' | 'weekly_menu' | 'beneficiaries' | 'stock' | 'hygiene'>(
    'budget_meals'
  );
  const sheetRef = useRef<HTMLDivElement>(null);

  // Add Daily Meal State
  const [newMealDate, setNewMealDate] = useState('2026-10-25');
  const [newMealDay, setNewMealDay] = useState('الأحد');
  const [newMealMain, setNewMealMain] = useState('');
  const [newMealSupp, setNewMealSupp] = useState('فاكهة موسمية + جبن + خبز');
  const [newMealActual, setNewMealActual] = useState<number>(canteenConfig.registeredStudentsCount || 180);
  const [newMealUnitCost, setNewMealUnitCost] = useState<number>(canteenConfig.defaultUnitCostDzd || 95);
  const [newMealNotes, setNewMealNotes] = useState('حفظ الوجبة الشاهدة 48 ساعة في الثلاجة');

  // Beneficiaries List State
  const [beneficiariesList, setBeneficiariesList] = useState<CanteenBeneficiaryStudent[]>(INITIAL_BENEFICIARIES_LIST);
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentLevel, setNewStudentLevel] = useState('السنة الأولى ابتدائي');
  const [newStudentCat, setNewStudentCat] = useState<CanteenBeneficiaryStudent['socialCategory']>('معوز');
  const [newStudentGuardian, setNewStudentGuardian] = useState('');

  // Stock State
  const [stockItems, setStockItems] = useState<CanteenStockItem[]>(INITIAL_STOCK_ITEMS);
  const [newStockName, setNewStockName] = useState('');
  const [newStockCat, setNewStockCat] = useState<CanteenStockItem['category']>('بقوليات وعجائن');
  const [newStockUnit, setNewStockUnit] = useState<CanteenStockItem['unit']>('كغ');
  const [newStockIn, setNewStockIn] = useState(50);

  // Hygiene & Workers State
  const [hygieneWorkers] = useState<CanteenHygieneCheck[]>(INITIAL_HYGIENE_WORKERS);

  // Calculations
  const totalMealsServed = dailyMeals.reduce((sum, r) => sum + r.actualBeneficiaries, 0);
  const totalRegisteredSum = dailyMeals.reduce((sum, r) => sum + r.registeredBeneficiaries, 0);
  const attendanceRate =
    totalRegisteredSum > 0 ? Math.round((totalMealsServed / totalRegisteredSum) * 100) : 0;

  const avgDailyBeneficiaries =
    dailyMeals.length > 0 ? Math.round(totalMealsServed / dailyMeals.length) : 0;

  const totalConsumedCostDzd = dailyMeals.reduce(
    (sum, r) => sum + r.actualBeneficiaries * r.unitCostDzd,
    0
  );

  const remainingBudgetDzd = Math.max(0, canteenConfig.allocatedBudgetDzd - totalConsumedCostDzd);
  const budgetUsedPercent =
    canteenConfig.allocatedBudgetDzd > 0
      ? Math.min(100, Number(((totalConsumedCostDzd / canteenConfig.allocatedBudgetDzd) * 100).toFixed(1)))
      : 0;

  const estimatedRemainingMealsCapacity =
    canteenConfig.defaultUnitCostDzd > 0
      ? Math.floor(remainingBudgetDzd / canteenConfig.defaultUnitCostDzd)
      : 0;

  const estimatedRemainingSchoolDays =
    canteenConfig.registeredStudentsCount > 0
      ? Math.floor(estimatedRemainingMealsCapacity / canteenConfig.registeredStudentsCount)
      : 0;

  const handleAddDailyMeal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMealMain.trim()) return;
    const item: DailyMealRecord = {
      id: 'meal_' + Date.now(),
      date: newMealDate,
      dayName: newMealDay,
      menuMain: newMealMain.trim(),
      menuSupplement: newMealSupp.trim(),
      registeredBeneficiaries: canteenConfig.registeredStudentsCount,
      actualBeneficiaries: Math.max(0, Number(newMealActual) || 0),
      unitCostDzd: Math.max(1, Number(newMealUnitCost) || canteenConfig.defaultUnitCostDzd),
      witnessMealKept: true,
      notes: newMealNotes.trim(),
    };
    setDailyMeals((prev) => [...prev, item]);
    setNewMealMain('');
  };

  const handleUpdateMealField = (
    id: string,
    field: keyof DailyMealRecord,
    value: string | number | boolean
  ) => {
    setDailyMeals((prev) =>
      prev.map((m) => {
        if (m.id !== id) return m;
        if (
          field === 'actualBeneficiaries' ||
          field === 'registeredBeneficiaries' ||
          field === 'unitCostDzd'
        ) {
          return { ...m, [field]: Math.max(0, Number(value) || 0) };
        }
        return { ...m, [field]: value };
      })
    );
  };

  const handleDeleteMeal = (id: string) => {
    setDailyMeals((prev) => prev.filter((m) => m.id !== id));
  };

  const handleApplyUnitCostToAll = () => {
    setDailyMeals((prev) =>
      prev.map((m) => ({
        ...m,
        unitCostDzd: canteenConfig.defaultUnitCostDzd,
        registeredBeneficiaries: canteenConfig.registeredStudentsCount,
      }))
    );
  };

  const handleAddBeneficiaryStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName.trim()) return;
    const st: CanteenBeneficiaryStudent = {
      id: 'bs_' + Date.now(),
      fullName: newStudentName.trim(),
      levelTitle: newStudentLevel,
      socialCategory: newStudentCat,
      guardianName: newStudentGuardian.trim() || 'ولي التلميذ',
      healthAllergyNote: 'لا توجد حساسية غذائية',
    };
    setBeneficiariesList((prev) => [...prev, st]);
    setNewStudentName('');
    setNewStudentGuardian('');
  };

  const handleAddStockItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStockName.trim()) return;
    const st: CanteenStockItem = {
      id: 'st_' + Date.now(),
      itemName: newStockName.trim(),
      category: newStockCat,
      unit: newStockUnit,
      qtyIn: Math.max(0, Number(newStockIn) || 0),
      qtyConsumed: 0,
      expiryDate: '2027-06-30',
      supplierName: canteenConfig.suppliersInfo,
    };
    setStockItems((prev) => [...prev, st]);
    setNewStockName('');
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="no-print bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-black text-[#094d22] flex items-center gap-2">
            <Utensils className="w-5 h-5 text-[#117a37]" />
            <span>منظومة تسيير المطعم المدرسي الشاملة (الميزانية · الوجبات · المستفيدون · المخزون · النظافة)</span>
          </h2>
          <p className="text-xs text-slate-600 mt-1">
            قسم مستقل ومتكامل لتسيير المطعم المدرسي وفق أحكام المرسوم التنفيذي 18-03 مع حساب آلي للتكلفة اليومية والميزانية ومخرجات A4/PDF
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() =>
              exportElementToPDF(
                sheetRef.current,
                `المطعم_المدرسي_${subTab}_${institution.school}`,
                'landscape'
              )
            }
            className="bg-[#117a37] hover:bg-[#094d22] text-white font-extrabold text-xs px-4 py-2 rounded-lg cursor-pointer transition flex items-center gap-1.5 shadow-xs"
          >
            <Download className="w-4 h-4" />
            <span>تحميل كشف المطعم (PDF)</span>
          </button>
          <button
            onClick={() =>
              triggerPrintOrPdf(`كشف_المطعم_المدرسي_${institution.school}`, sheetRef.current)
            }
            className="bg-[#d91424] hover:bg-[#9e0b17] text-white font-extrabold text-xs px-4 py-2 rounded-lg cursor-pointer transition flex items-center gap-1.5 shadow-xs"
          >
            <Printer className="w-4 h-4" />
            <span>طباعة الوثيقة الرسمية (A4)</span>
          </button>
        </div>
      </div>

      {/* Sub-Navigation Tabs for All Canteen Sections */}
      <div className="no-print bg-white border border-slate-200 rounded-xl p-3 shadow-xs flex flex-wrap items-center gap-2">
        {[
          {
            id: 'budget_meals',
            label: '1. الميزانية والوجبات اليومية والتكلفة',
            icon: <Coins className="w-3.5 h-3.5" />,
          },
          {
            id: 'weekly_menu',
            label: '2. الجدول الغذائي الأسبوعي المعتمد',
            icon: <CalendarRange className="w-3.5 h-3.5" />,
          },
          {
            id: 'beneficiaries',
            label: '3. قائمة التلاميذ المستفيدين من الإطعام',
            icon: <Users className="w-3.5 h-3.5" />,
          },
          {
            id: 'stock',
            label: '4. جرد المخزون الغذائي والتموين',
            icon: <PackageCheck className="w-3.5 h-3.5" />,
          },
          {
            id: 'hygiene',
            label: '5. الرقابة الصحية والطبق الشاهد والعمال',
            icon: <ShieldCheck className="w-3.5 h-3.5" />,
          },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSubTab(tab.id as typeof subTab)}
            className={`px-3.5 py-2 rounded-lg text-xs font-extrabold cursor-pointer transition flex items-center gap-1.5 ${
              subTab === tab.id
                ? 'bg-[#117a37] text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Top Financial & Beneficiaries KPI Strip */}
      <div className="no-print grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
            <span>الميزانية السنوية المخصصة</span>
            <Coins className="w-4 h-4 text-[#094d22]" />
          </div>
          <div className="text-xl font-black text-[#094d22] mt-1.5 tabular-nums">
            {canteenConfig.allocatedBudgetDzd.toLocaleString('ar-DZ')} دج
          </div>
          <div className="text-[11px] text-slate-500 mt-1">إعانة الدولة + مساهمة البلدية</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
            <span>متوسط المستفيدين اليومي</span>
            <Users className="w-4 h-4 text-[#117a37]" />
          </div>
          <div className="text-xl font-black text-[#117a37] mt-1.5 tabular-nums">
            {avgDailyBeneficiaries} / {canteenConfig.registeredStudentsCount} تلميذ
          </div>
          <div className="text-[11px] text-slate-600 mt-1 tabular-nums">
            نسبة الحضور في المطعم: {attendanceRate}% (من أصل {totalSchoolStudents} بالمدرسة)
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
            <span>مجموع الوجبات المقدمة</span>
            <Utensils className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-xl font-black text-slate-900 mt-1.5 tabular-nums">
            {totalMealsServed.toLocaleString('ar-DZ')} وجبة
          </div>
          <div className="text-[11px] text-slate-500 mt-1 tabular-nums">
            خلال {dailyMeals.length} أيام إطعام مسجلة · التسعيرة: {canteenConfig.defaultUnitCostDzd} دج
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
            <span>التكلفة الإجمالية المستهلكة</span>
            <TrendingUp className="w-4 h-4 text-[#d91424]" />
          </div>
          <div className="text-xl font-black text-[#d91424] mt-1.5 tabular-nums">
            {totalConsumedCostDzd.toLocaleString('ar-DZ')} دج
          </div>
          <div className="text-[11px] text-slate-600 mt-1 tabular-nums">
            نسبة استهلاك الاعتماد: {budgetUsedPercent}%
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
            <span>الرصيد المالي المتبقي</span>
            <CheckCircle2 className="w-4 h-4 text-[#117a37]" />
          </div>
          <div className="text-xl font-black text-[#094d22] mt-1.5 tabular-nums">
            {remainingBudgetDzd.toLocaleString('ar-DZ')} دج
          </div>
          <div className="text-[11px] text-slate-600 mt-1 tabular-nums">
            يكفي لحوالي {estimatedRemainingMealsCapacity.toLocaleString('ar-DZ')} وجبة ({estimatedRemainingSchoolDays} يوم)
          </div>
        </div>
      </div>

      {/* SUB-TAB 1: الميزانية والوجبات اليومية والتكلفة */}
      {subTab === 'budget_meals' && (
        <>
          <div className="no-print grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Right Column: Financial Configuration */}
            <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
                <h3 className="text-sm font-black text-[#094d22]">
                  ضبط الميزانية السنوية وتسعيرة الوجبة والتعداد المسجل
                </h3>
                <button
                  onClick={handleApplyUnitCostToAll}
                  className="text-[11px] font-extrabold text-[#117a37] hover:underline cursor-pointer flex items-center gap-1"
                >
                  <Calculator className="w-3 h-3" />
                  <span>تعميم التسعيرة</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    الميزانية الإجمالية المخصصة (دج)
                  </label>
                  <input
                    type="number"
                    min={0}
                    step={10000}
                    value={canteenConfig.allocatedBudgetDzd}
                    onChange={(e) =>
                      setCanteenConfig((prev) => ({
                        ...prev,
                        allocatedBudgetDzd: Math.max(0, Number(e.target.value) || 0),
                      }))
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-black text-[#094d22] tabular-nums"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    تسعيرة الوجبة اليومية الواحدة (دج)
                  </label>
                  <input
                    type="number"
                    min={10}
                    value={canteenConfig.defaultUnitCostDzd}
                    onChange={(e) =>
                      setCanteenConfig((prev) => ({
                        ...prev,
                        defaultUnitCostDzd: Math.max(1, Number(e.target.value) || 0),
                      }))
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-black text-[#d91424] tabular-nums"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    عدد التلاميذ المسجلين بالمطعم
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={canteenConfig.registeredStudentsCount}
                    onChange={(e) =>
                      setCanteenConfig((prev) => ({
                        ...prev,
                        registeredStudentsCount: Math.max(1, Number(e.target.value) || 0),
                      }))
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-bold tabular-nums"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    مسير المطعم / المستشار المكلف
                  </label>
                  <input
                    type="text"
                    value={canteenConfig.canteenManagerName}
                    onChange={(e) =>
                      setCanteenConfig((prev) => ({
                        ...prev,
                        canteenManagerName: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    إعانة الدولة للتغذية المدرسية (دج)
                  </label>
                  <input
                    type="number"
                    min={0}
                    step={10000}
                    value={canteenConfig.stateGrantDzd}
                    onChange={(e) =>
                      setCanteenConfig((prev) => ({
                        ...prev,
                        stateGrantDzd: Math.max(0, Number(e.target.value) || 0),
                      }))
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-bold tabular-nums"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    مساهمة ميزانية البلدية (دج)
                  </label>
                  <input
                    type="number"
                    min={0}
                    step={10000}
                    value={canteenConfig.municipalityContributionDzd}
                    onChange={(e) =>
                      setCanteenConfig((prev) => ({
                        ...prev,
                        municipalityContributionDzd: Math.max(0, Number(e.target.value) || 0),
                      }))
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-bold tabular-nums"
                  />
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 space-y-2">
                <div className="flex justify-between text-xs font-extrabold">
                  <span className="text-slate-700">مؤشر استهلاك ميزانية المطعم المدرسي</span>
                  <span className="text-[#d91424] tabular-nums">{budgetUsedPercent}% مستهلك</span>
                </div>
                <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-l from-[#117a37] to-[#d91424] h-full rounded-full transition-all"
                    style={{ width: `${Math.max(3, budgetUsedPercent)}%` }}
                  />
                </div>
                <div className="flex justify-between text-[11px] font-bold text-slate-600 tabular-nums">
                  <span>المستهلك: {totalConsumedCostDzd.toLocaleString('ar-DZ')} دج</span>
                  <span>المتبقي: {remainingBudgetDzd.toLocaleString('ar-DZ')} دج</span>
                </div>
              </div>
            </div>

            {/* Left Column: Add New Daily Meal Record */}
            <form
              onSubmit={handleAddDailyMeal}
              className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4"
            >
              <h3 className="text-sm font-black text-[#094d22] border-b border-slate-200 pb-2.5">
                إضافة حصيلة وجبة يومية جديدة وحساب تكلفتها الفورية
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">تاريخ اليوم</label>
                  <input
                    type="date"
                    value={newMealDate}
                    onChange={(e) => setNewMealDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-bold tabular-nums"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">اليوم الدراسي</label>
                  <select
                    value={newMealDay}
                    onChange={(e) => setNewMealDay(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-bold bg-white"
                  >
                    <option value="الأحد">الأحد</option>
                    <option value="الاثنين">الاثنين</option>
                    <option value="الثلاثاء">الثلاثاء</option>
                    <option value="الأربعاء">الأربعاء</option>
                    <option value="الخميس">الخميس</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">عدد المستفيدين الفعلي</label>
                  <input
                    type="number"
                    min={0}
                    value={newMealActual}
                    onChange={(e) => setNewMealActual(Number(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-black text-[#117a37] tabular-nums"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">تكلفة الوجبة (دج)</label>
                  <input
                    type="number"
                    min={1}
                    value={newMealUnitCost}
                    onChange={(e) => setNewMealUnitCost(Number(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-black text-[#d91424] tabular-nums"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">الطبق الرئيسي للوجبة الساخنة</label>
                  <input
                    type="text"
                    placeholder="مثال: عدس بلحم العجل + سلطة خضراء..."
                    value={newMealMain}
                    onChange={(e) => setNewMealMain(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-bold"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">
                    المكملات الغذائية (الفاكهة / المشتقات / الخبز)
                  </label>
                  <input
                    type="text"
                    value={newMealSupp}
                    onChange={(e) => setNewMealSupp(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-bold"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label className="block font-bold text-slate-700 mb-1">
                    ملاحظات الرقابة الصحية والوجبة الشاهدة
                  </label>
                  <input
                    type="text"
                    value={newMealNotes}
                    onChange={(e) => setNewMealNotes(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-bold"
                  />
                </div>

                <div className="flex items-end">
                  <button
                    type="submit"
                    className="w-full py-2 px-3 bg-[#117a37] hover:bg-[#094d22] text-white font-extrabold rounded-lg transition cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    <span>إدراج الوجبة ({(newMealActual * newMealUnitCost).toLocaleString('ar-DZ')} دج)</span>
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Interactive Table of Daily Meals & Cost Calculation */}
          <div className="no-print bg-white border border-slate-200 rounded-xl p-5 shadow-xs overflow-x-auto">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div>
                <h3 className="text-sm font-black text-[#094d22]">
                  سجل المتابعة اليومية للوجبات المقدمة وعدد المستفيدين والتكلفة المالية
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  عدّل عدد المستفيدين اليومي أو سعر الوجبة مباشرة ليتم تحيين التكلفة الإجمالية والرصيد المتبقي فوراً
                </p>
              </div>
              <div className="text-xs font-black text-[#d91424] bg-rose-50 border border-rose-200 px-3 py-1.5 rounded-lg tabular-nums">
                إجمالي تكلفة الوجبات المسجلة: {totalConsumedCostDzd.toLocaleString('ar-DZ')} دج
              </div>
            </div>

            <table className="w-full text-right border-collapse text-xs">
              <thead>
                <tr className="bg-slate-100 border-y border-slate-300 text-[#094d22] font-black">
                  <th className="py-2.5 px-2.5">#</th>
                  <th className="py-2.5 px-2.5">التاريخ واليوم</th>
                  <th className="py-2.5 px-2.5">قائمة الوجبة الساخنة والمكملات</th>
                  <th className="py-2.5 px-2.5 text-center">المسجلون</th>
                  <th className="py-2.5 px-2.5 text-center">المستفيدون الفعليون</th>
                  <th className="py-2.5 px-2.5 text-center">الغياب</th>
                  <th className="py-2.5 px-2.5 text-center">سعر الوجبة (دج)</th>
                  <th className="py-2.5 px-2.5 text-center">التكلفة اليومية الإجمالية</th>
                  <th className="py-2.5 px-2.5 text-center">الطبق الشاهد</th>
                  <th className="py-2.5 px-2.5">ملاحظات الرقابة</th>
                  <th className="py-2.5 px-2.5 text-center">إجراء</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {dailyMeals.map((meal, index) => {
                  const absences = Math.max(0, meal.registeredBeneficiaries - meal.actualBeneficiaries);
                  const dailyTotalCost = meal.actualBeneficiaries * meal.unitCostDzd;
                  return (
                    <tr key={meal.id} className="hover:bg-slate-50">
                      <td className="py-2.5 px-2.5 font-bold tabular-nums">{index + 1}</td>
                      <td className="py-2.5 px-2.5 font-bold whitespace-nowrap">
                        <div>{meal.dayName}</div>
                        <div className="text-[11px] text-slate-500 tabular-nums">{meal.date}</div>
                      </td>
                      <td className="py-2.5 px-2.5">
                        <input
                          type="text"
                          value={meal.menuMain}
                          onChange={(e) => handleUpdateMealField(meal.id, 'menuMain', e.target.value)}
                          className="w-full px-2 py-1 border border-slate-200 rounded font-extrabold text-slate-900 mb-1"
                        />
                        <input
                          type="text"
                          value={meal.menuSupplement}
                          onChange={(e) => handleUpdateMealField(meal.id, 'menuSupplement', e.target.value)}
                          className="w-full px-2 py-0.5 border border-slate-200 rounded text-[11px] text-slate-600"
                        />
                      </td>
                      <td className="py-2.5 px-2.5 text-center">
                        <input
                          type="number"
                          min={0}
                          value={meal.registeredBeneficiaries}
                          onChange={(e) =>
                            handleUpdateMealField(meal.id, 'registeredBeneficiaries', e.target.value)
                          }
                          className="w-16 px-1.5 py-1 border border-slate-300 rounded text-center font-bold tabular-nums"
                        />
                      </td>
                      <td className="py-2.5 px-2.5 text-center">
                        <input
                          type="number"
                          min={0}
                          value={meal.actualBeneficiaries}
                          onChange={(e) =>
                            handleUpdateMealField(meal.id, 'actualBeneficiaries', e.target.value)
                          }
                          className="w-16 px-1.5 py-1 border-2 border-[#117a37] bg-emerald-50/50 rounded text-center font-black text-[#094d22] tabular-nums"
                        />
                      </td>
                      <td className="py-2.5 px-2.5 text-center font-bold text-slate-600 tabular-nums">
                        {absences}
                      </td>
                      <td className="py-2.5 px-2.5 text-center">
                        <input
                          type="number"
                          min={1}
                          value={meal.unitCostDzd}
                          onChange={(e) => handleUpdateMealField(meal.id, 'unitCostDzd', e.target.value)}
                          className="w-16 px-1.5 py-1 border border-slate-300 rounded text-center font-bold tabular-nums"
                        />
                      </td>
                      <td className="py-2.5 px-2.5 text-center font-black text-[#d91424] tabular-nums whitespace-nowrap">
                        {dailyTotalCost.toLocaleString('ar-DZ')} دج
                      </td>
                      <td className="py-2.5 px-2.5 text-center">
                        <input
                          type="checkbox"
                          checked={meal.witnessMealKept}
                          onChange={(e) =>
                            handleUpdateMealField(meal.id, 'witnessMealKept', e.target.checked)
                          }
                          className="w-4 h-4 accent-[#117a37] cursor-pointer"
                        />
                      </td>
                      <td className="py-2.5 px-2.5">
                        <input
                          type="text"
                          value={meal.notes}
                          onChange={(e) => handleUpdateMealField(meal.id, 'notes', e.target.value)}
                          className="w-full px-2 py-1 border border-slate-200 rounded text-[11px] font-semibold"
                        />
                      </td>
                      <td className="py-2.5 px-2.5 text-center">
                        <button
                          onClick={() => handleDeleteMeal(meal.id)}
                          className="p-1.5 text-rose-600 hover:bg-rose-50 rounded cursor-pointer"
                          title="حذف السجل"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* SUB-TAB 2: الجدول الغذائي الأسبوعي المعتمد */}
      {subTab === 'weekly_menu' && (
        <div className="no-print bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
          <h3 className="text-sm font-black text-[#094d22]">
            الجدول الغذائي الأسبوعي المتوازن المعتمد من طرف الطبيب المدرسي (UDS) ومفتش التغذية المدرسية
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse text-xs">
              <thead>
                <tr className="bg-[#e8f5e9] border-y border-[#117a37]/30 text-[#094d22] font-black">
                  <th className="py-2.5 px-3">اليوم الدراسي</th>
                  <th className="py-2.5 px-3">الطبق الرئيسي الساخن (بروتينات + نشويات/بقوليات)</th>
                  <th className="py-2.5 px-3">المكمل الغذائي والفاكهة الموسمية</th>
                  <th className="py-2.5 px-3">القيمة الطاقوية التقديرية</th>
                  <th className="py-2.5 px-3">توقيت التوزيع</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {dailyMeals.slice(0, 5).map((m, i) => (
                  <tr key={m.id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-black text-[#d91424]">{m.dayName}</td>
                    <td className="py-2.5 px-3 font-extrabold text-slate-900">{m.menuMain}</td>
                    <td className="py-2.5 px-3 font-bold text-[#094d22]">{m.menuSupplement}</td>
                    <td className="py-2.5 px-3 font-bold tabular-nums">{780 + i * 25} سعرة حرارية (Kcal)</td>
                    <td className="py-2.5 px-3 font-bold">
                      {m.dayName === 'الثلاثاء' ? '11:00 - 11:30 صباحاً' : '11:15 - 12:30 زوالاً'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: قائمة التلاميذ المستفيدين من الإطعام */}
      {subTab === 'beneficiaries' && (
        <div className="no-print bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-black text-[#094d22]">
                القائمة الاسمية للتلاميذ المستفيدين من المطعم المدرسي ({canteenConfig.registeredStudentsCount} تلميذ مسجل)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                تصنيف المستفيدين حسب الحالة الاجتماعية والصحية (معوز · يتيم · بعد المسافة · ذوي الدخل الضعيف)
              </p>
            </div>
          </div>

          <form
            onSubmit={handleAddBeneficiaryStudent}
            className="grid grid-cols-1 sm:grid-cols-5 gap-2.5 bg-slate-50 p-3.5 rounded-lg border border-slate-200 text-xs"
          >
            <input
              type="text"
              placeholder="اسم ولقب التلميذ(ة)..."
              value={newStudentName}
              onChange={(e) => setNewStudentName(e.target.value)}
              className="px-3 py-2 border border-slate-300 rounded-lg font-bold bg-white"
            />
            <select
              value={newStudentLevel}
              onChange={(e) => setNewStudentLevel(e.target.value)}
              className="px-3 py-2 border border-slate-300 rounded-lg font-bold bg-white"
            >
              <option value="التربية التحضيرية">التربية التحضيرية</option>
              <option value="السنة الأولى ابتدائي">السنة الأولى ابتدائي</option>
              <option value="السنة الثانية ابتدائي">السنة الثانية ابتدائي</option>
              <option value="السنة الثالثة ابتدائي">السنة الثالثة ابتدائي</option>
              <option value="السنة الرابعة ابتدائي">السنة الرابعة ابتدائي</option>
              <option value="السنة الخامسة ابتدائي">السنة الخامسة ابتدائي</option>
            </select>
            <select
              value={newStudentCat}
              onChange={(e) => setNewStudentCat(e.target.value as CanteenBeneficiaryStudent['socialCategory'])}
              className="px-3 py-2 border border-slate-300 rounded-lg font-bold bg-white"
            >
              <option value="معوز">معوز</option>
              <option value="يتيم">يتيم</option>
              <option value="بعد المسافة">بعد المسافة</option>
              <option value="ذوي الدخل الضعيف">ذوي الدخل الضعيف</option>
            </select>
            <input
              type="text"
              placeholder="اسم الولي..."
              value={newStudentGuardian}
              onChange={(e) => setNewStudentGuardian(e.target.value)}
              className="px-3 py-2 border border-slate-300 rounded-lg font-bold bg-white"
            />
            <button
              type="submit"
              className="bg-[#117a37] hover:bg-[#094d22] text-white font-extrabold rounded-lg px-3 py-2 cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة للمستفيدين</span>
            </button>
          </form>

          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse text-xs">
              <thead>
                <tr className="bg-slate-100 border-y border-slate-300 text-[#094d22] font-black">
                  <th className="py-2.5 px-3">#</th>
                  <th className="py-2.5 px-3">اسم ولقب التلميذ(ة)</th>
                  <th className="py-2.5 px-3">المستوى الدراسي</th>
                  <th className="py-2.5 px-3">الصفة الاجتماعية</th>
                  <th className="py-2.5 px-3">اسم ولقب الولي</th>
                  <th className="py-2.5 px-3">الملاحظة الصحية / الحساسية الغذائية</th>
                  <th className="py-2.5 px-3 text-center">حذف</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {beneficiariesList.map((st, idx) => (
                  <tr key={st.id} className="hover:bg-slate-50">
                    <td className="py-2 px-3 font-bold tabular-nums">{idx + 1}</td>
                    <td className="py-2 px-3 font-extrabold text-slate-900">{st.fullName}</td>
                    <td className="py-2 px-3 font-bold text-[#094d22]">{st.levelTitle}</td>
                    <td className="py-2 px-3 font-bold text-[#d91424]">{st.socialCategory}</td>
                    <td className="py-2 px-3 font-bold">{st.guardianName}</td>
                    <td className="py-2 px-3 text-slate-600">{st.healthAllergyNote}</td>
                    <td className="py-2 px-3 text-center">
                      <button
                        onClick={() =>
                          setBeneficiariesList((prev) => prev.filter((item) => item.id !== st.id))
                        }
                        className="p-1 text-rose-600 hover:bg-rose-50 rounded cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB-TAB 4: جرد المخزون الغذائي والتموين */}
      {subTab === 'stock' && (
        <div className="no-print bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
          <h3 className="text-sm font-black text-[#094d22]">
            بطاقة جرد ومراقبة مخزون المواد الغذائية وحركة التموين بالمطعم المدرسي
          </h3>

          <form
            onSubmit={handleAddStockItem}
            className="grid grid-cols-1 sm:grid-cols-5 gap-2.5 bg-slate-50 p-3.5 rounded-lg border border-slate-200 text-xs"
          >
            <input
              type="text"
              placeholder="اسم المادة الغذائية..."
              value={newStockName}
              onChange={(e) => setNewStockName(e.target.value)}
              className="px-3 py-2 border border-slate-300 rounded-lg font-bold bg-white sm:col-span-2"
            />
            <select
              value={newStockCat}
              onChange={(e) => setNewStockCat(e.target.value as CanteenStockItem['category'])}
              className="px-3 py-2 border border-slate-300 rounded-lg font-bold bg-white"
            >
              <option value="بقوليات وعجائن">بقوليات وعجائن</option>
              <option value="لحوم ودواجن">لحوم ودواجن</option>
              <option value="خضر وفواكه">خضر وفواكه</option>
              <option value="حليب ومشتقاته">حليب ومشتقاته</option>
              <option value="مواد بقالة وخبز">مواد بقالة وخبز</option>
            </select>
            <div className="flex gap-1.5">
              <input
                type="number"
                min={1}
                value={newStockIn}
                onChange={(e) => setNewStockIn(Number(e.target.value) || 0)}
                className="w-full px-2 py-2 border border-slate-300 rounded-lg font-bold tabular-nums bg-white"
              />
              <select
                value={newStockUnit}
                onChange={(e) => setNewStockUnit(e.target.value as CanteenStockItem['unit'])}
                className="px-2 py-2 border border-slate-300 rounded-lg font-bold bg-white"
              >
                <option value="كغ">كغ</option>
                <option value="لتر">لتر</option>
                <option value="علبة">علبة</option>
                <option value="وحدة">وحدة</option>
              </select>
            </div>
            <button
              type="submit"
              className="bg-[#117a37] hover:bg-[#094d22] text-white font-extrabold rounded-lg px-3 py-2 cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة للمخزن</span>
            </button>
          </form>

          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse text-xs">
              <thead>
                <tr className="bg-slate-100 border-y border-slate-300 text-[#094d22] font-black">
                  <th className="py-2.5 px-3">المادة الغذائية</th>
                  <th className="py-2.5 px-3">الصنف</th>
                  <th className="py-2.5 px-3 text-center">الكمية المستلمة</th>
                  <th className="py-2.5 px-3 text-center">الكمية المستهلكة</th>
                  <th className="py-2.5 px-3 text-center">المخزون المتبقي</th>
                  <th className="py-2.5 px-3">تاريخ الصلاحية</th>
                  <th className="py-2.5 px-3">الممون المعتمد</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {stockItems.map((st) => {
                  const rem = Math.max(0, st.qtyIn - st.qtyConsumed);
                  return (
                    <tr key={st.id} className="hover:bg-slate-50">
                      <td className="py-2.5 px-3 font-extrabold text-slate-900">{st.itemName}</td>
                      <td className="py-2.5 px-3 font-bold text-[#094d22]">{st.category}</td>
                      <td className="py-2.5 px-3 text-center font-bold tabular-nums">
                        {st.qtyIn} {st.unit}
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <input
                          type="number"
                          min={0}
                          max={st.qtyIn}
                          value={st.qtyConsumed}
                          onChange={(e) => {
                            const val = Math.max(0, Number(e.target.value) || 0);
                            setStockItems((prev) =>
                              prev.map((x) => (x.id === st.id ? { ...x, qtyConsumed: val } : x))
                            );
                          }}
                          className="w-20 px-2 py-1 border border-slate-300 rounded text-center font-bold tabular-nums"
                        />
                      </td>
                      <td className="py-2.5 px-3 text-center font-black text-[#117a37] tabular-nums">
                        {rem} {st.unit}
                      </td>
                      <td className="py-2.5 px-3 font-bold text-[#d91424] tabular-nums">{st.expiryDate}</td>
                      <td className="py-2.5 px-3 text-slate-600 font-semibold">{st.supplierName}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB-TAB 5: الرقابة الصحية والطبق الشاهد والعمال */}
      {subTab === 'hygiene' && (
        <div className="no-print bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
          <h3 className="text-sm font-black text-[#094d22]">
            سجل الرقابة الصحية والوقائية، الطبق الشاهد (48 ساعة)، والمتابعة الطبية لأعوان المطعم
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse text-xs">
              <thead>
                <tr className="bg-[#e8f5e9] border-y border-[#117a37]/30 text-[#094d22] font-black">
                  <th className="py-2.5 px-3">اسم ولقب العون</th>
                  <th className="py-2.5 px-3">الوظيفة بالمطعم</th>
                  <th className="py-2.5 px-3">تاريخ آخر فحص طبي وتحاليل</th>
                  <th className="py-2.5 px-3">الوضعية الصحية</th>
                  <th className="py-2.5 px-3">المهام اليومية والوقائية المسندة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {hygieneWorkers.map((hw) => (
                  <tr key={hw.id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-extrabold text-slate-900">{hw.workerName}</td>
                    <td className="py-2.5 px-3 font-bold text-[#094d22]">{hw.role}</td>
                    <td className="py-2.5 px-3 font-bold tabular-nums">{hw.medicalCertDate}</td>
                    <td className="py-2.5 px-3 font-black text-[#117a37]">{hw.medicalStatus}</td>
                    <td className="py-2.5 px-3 font-semibold text-slate-700">{hw.dailyTask}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Printable Official A4 Landscape Sheet for Active Canteen Sub-Tab */}
      <div className="sheet-scroll-container">
        <div ref={sheetRef} className="a4-landscape-page" dir="rtl">
          <div className="sheet-header-grid">
            <div className="sheet-right-col">
              <div>مديرية التربية لولاية : {institution.wilaya}</div>
              <div>مقاطعة التفتيش : {institution.district}</div>
              <div>المدرسة الابتدائية : {institution.school}</div>
              <div>مسير المطعم : {canteenConfig.canteenManagerName}</div>
            </div>

            <div className="sheet-center-col">
              <div className="rep-heading">الجمهورية الجزائرية الديمقراطية الشعبية</div>
              <div className="min-heading">وزارة التربية الوطنية</div>
              <div className="title-frame-with-logo">
                <img src={logoUrl} alt="SNTE" />
                <div className="title-frame-text">
                  <span className="main-doc-title">
                    {subTab === 'budget_meals' &&
                      'الكشف الرسمي لمتابعة الوجبات اليومية والوضعية المالية للمطعم المدرسي'}
                    {subTab === 'weekly_menu' &&
                      'الجدول الغذائي الأسبوعي الرسمي المعتمد للمطعم المدرسي'}
                    {subTab === 'beneficiaries' &&
                      'القائمة الاسمية الرسمية للتلاميذ المستفيدين من المطعم المدرسي'}
                    {subTab === 'stock' &&
                      'بطاقة الجرد الرسمي للمخزون الغذائي وحركة التموين بالمطعم المدرسي'}
                    {subTab === 'hygiene' &&
                      'سجل الرقابة الصحية والنظافة والمتابعة الطبية لأعوان المطعم المدرسي'}
                  </span>
                </div>
              </div>
            </div>

            <div className="sheet-left-col">
              <div>السنة الدراسية : {institution.year}</div>
              <div>المدير(ة) : {institution.directorName}</div>
              <div>المرجع : المرسوم التنفيذي 18-03</div>
              <div className="text-[11px] text-[#094d22]">{OFFICIAL_AUTHOR_SIGNATURE}</div>
            </div>
          </div>

          {/* Summary Financial Bar inside Print Sheet */}
          <div className="grid grid-cols-5 gap-2 my-2 text-center text-[11px] font-black">
            <div className="border border-black p-1.5 bg-[#f8fafc]">
              <div>الميزانية المخصصة للمطعم</div>
              <div className="text-xs text-[#094d22] tabular-nums">
                {canteenConfig.allocatedBudgetDzd.toLocaleString('ar-DZ')} دج
              </div>
            </div>
            <div className="border border-black p-1.5 bg-[#f8fafc]">
              <div>عدد التلاميذ المسجلين بالمطعم</div>
              <div className="text-xs text-[#094d22] tabular-nums">
                {canteenConfig.registeredStudentsCount} تلميذ
              </div>
            </div>
            <div className="border border-black p-1.5 bg-[#f8fafc]">
              <div>مجموع الوجبات المقدمة فعلياً</div>
              <div className="text-xs text-[#094d22] tabular-nums">
                {totalMealsServed} وجبة ({attendanceRate}%)
              </div>
            </div>
            <div className="border border-black p-1.5 bg-[#fff1f2]">
              <div>التكلفة الإجمالية المستهلكة</div>
              <div className="text-xs text-[#d91424] tabular-nums">
                {totalConsumedCostDzd.toLocaleString('ar-DZ')} دج
              </div>
            </div>
            <div className="border border-black p-1.5 bg-[#f0fdf4]">
              <div>الرصيد المالي المتبقي</div>
              <div className="text-xs text-[#094d22] tabular-nums">
                {remainingBudgetDzd.toLocaleString('ar-DZ')} دج
              </div>
            </div>
          </div>

          {(subTab === 'budget_meals' || subTab === 'weekly_menu') && (
            <table className="timetable-grid mt-1">
              <thead>
                <tr className="hours-header">
                  <th style={{ width: '35px' }}>الرقم</th>
                  <th style={{ width: '95px' }}>اليوم والتاريخ</th>
                  <th>الوجبة الساخنة المقدمة والمكملات</th>
                  <th style={{ width: '70px' }}>المسجلون</th>
                  <th style={{ width: '85px' }}>المستفيدون الفعليون</th>
                  <th style={{ width: '60px' }}>الغياب</th>
                  <th style={{ width: '75px' }}>تسعيرة الوجبة</th>
                  <th style={{ width: '105px' }}>التكلفة اليومية</th>
                  <th style={{ width: '75px' }}>الطبق الشاهد</th>
                  <th>ملاحظات المراقبة الصحية</th>
                </tr>
              </thead>
              <tbody>
                {dailyMeals.map((m, i) => {
                  const abs = Math.max(0, m.registeredBeneficiaries - m.actualBeneficiaries);
                  const cost = m.actualBeneficiaries * m.unitCostDzd;
                  return (
                    <tr key={m.id}>
                      <td className="font-bold tabular-nums py-1">{i + 1}</td>
                      <td className="font-bold py-1">
                        {m.dayName} ({m.date})
                      </td>
                      <td className="text-right px-2 font-bold py-1">
                        {m.menuMain} — <span className="font-normal">{m.menuSupplement}</span>
                      </td>
                      <td className="tabular-nums font-bold">{m.registeredBeneficiaries}</td>
                      <td className="tabular-nums font-black text-[#094d22]">
                        {m.actualBeneficiaries}
                      </td>
                      <td className="tabular-nums">{abs}</td>
                      <td className="tabular-nums font-bold">{m.unitCostDzd} دج</td>
                      <td className="tabular-nums font-black text-[#d91424]">
                        {cost.toLocaleString('ar-DZ')} دج
                      </td>
                      <td className="font-bold">{m.witnessMealKept ? 'محفوظ 48 سا' : '—'}</td>
                      <td className="text-right px-2 text-[10px]">{m.notes}</td>
                    </tr>
                  );
                })}
                <tr className="bg-[#e8f5e9] font-black">
                  <td colSpan={3} className="py-1.5">
                    المجموع الإجمالي لاستهلاك الوجبات والتكلفة المالية
                  </td>
                  <td className="tabular-nums">{totalRegisteredSum}</td>
                  <td className="tabular-nums text-[#094d22]">{totalMealsServed} وجبة</td>
                  <td className="tabular-nums">
                    {Math.max(0, totalRegisteredSum - totalMealsServed)}
                  </td>
                  <td className="tabular-nums">{canteenConfig.defaultUnitCostDzd} دج</td>
                  <td className="tabular-nums text-[#d91424]">
                    {totalConsumedCostDzd.toLocaleString('ar-DZ')} دج
                  </td>
                  <td colSpan={2}>
                    الرصيد المتبقي: {remainingBudgetDzd.toLocaleString('ar-DZ')} دج
                  </td>
                </tr>
              </tbody>
            </table>
          )}

          {subTab === 'beneficiaries' && (
            <table className="timetable-grid mt-1">
              <thead>
                <tr className="hours-header">
                  <th style={{ width: '40px' }}>الرقم</th>
                  <th>اسم ولقب التلميذ(ة) المستفيد(ة)</th>
                  <th>المستوى الدراسي</th>
                  <th>الصفة الاجتماعية</th>
                  <th>اسم ولقب الولي</th>
                  <th>الملاحظة الصحية / الغذائية</th>
                </tr>
              </thead>
              <tbody>
                {beneficiariesList.map((st, idx) => (
                  <tr key={st.id}>
                    <td className="font-bold tabular-nums py-1.5">{idx + 1}</td>
                    <td className="font-extrabold text-right px-2">{st.fullName}</td>
                    <td className="font-bold">{st.levelTitle}</td>
                    <td className="font-bold text-[#d91424]">{st.socialCategory}</td>
                    <td className="font-bold">{st.guardianName}</td>
                    <td>{st.healthAllergyNote}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {subTab === 'stock' && (
            <table className="timetable-grid mt-1">
              <thead>
                <tr className="hours-header">
                  <th style={{ width: '40px' }}>الرقم</th>
                  <th>بيان المادة الغذائية</th>
                  <th>الصنف</th>
                  <th>الكمية المستلمة</th>
                  <th>الكمية المستهلكة</th>
                  <th>المخزون المتبقي</th>
                  <th>تاريخ الصلاحية</th>
                  <th>الممون المعتمد</th>
                </tr>
              </thead>
              <tbody>
                {stockItems.map((st, idx) => (
                  <tr key={st.id}>
                    <td className="font-bold tabular-nums py-1.5">{idx + 1}</td>
                    <td className="font-extrabold text-right px-2">{st.itemName}</td>
                    <td className="font-bold">{st.category}</td>
                    <td className="font-bold tabular-nums">
                      {st.qtyIn} {st.unit}
                    </td>
                    <td className="font-bold tabular-nums">
                      {st.qtyConsumed} {st.unit}
                    </td>
                    <td className="font-black text-[#094d22] tabular-nums">
                      {Math.max(0, st.qtyIn - st.qtyConsumed)} {st.unit}
                    </td>
                    <td className="font-bold text-[#d91424] tabular-nums">{st.expiryDate}</td>
                    <td className="text-right px-2">{st.supplierName}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {subTab === 'hygiene' && (
            <table className="timetable-grid mt-1">
              <thead>
                <tr className="hours-header">
                  <th style={{ width: '40px' }}>الرقم</th>
                  <th>اسم ولقب العون</th>
                  <th>الوظيفة بالمطعم</th>
                  <th>تاريخ الشهادة الطبية الدورية</th>
                  <th>الوضعية الصحية</th>
                  <th>المهام الوقائية والصحية اليومية</th>
                </tr>
              </thead>
              <tbody>
                {hygieneWorkers.map((hw, idx) => (
                  <tr key={hw.id}>
                    <td className="font-bold tabular-nums py-2">{idx + 1}</td>
                    <td className="font-extrabold text-right px-2">{hw.workerName}</td>
                    <td className="font-bold">{hw.role}</td>
                    <td className="font-bold tabular-nums">{hw.medicalCertDate}</td>
                    <td className="font-black text-[#094d22]">{hw.medicalStatus}</td>
                    <td className="text-right px-2">{hw.dailyTask}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          <div className="footer-signatures mt-5">
            <div>إمضاء مسير المطعم المدرسي</div>
            <div>إمضاء وختم السيد(ة) مدير(ة) المدرسة</div>
            <div>مصادقة مصالح البلدية / التغذية المدرسية</div>
          </div>
        </div>
      </div>
    </div>
  );
}
