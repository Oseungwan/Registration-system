import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const copy = {
  en: {
    langLabel: 'English',
    hero: {
      title: 'KLN SEAPORT NEW YEAR PARTY 2026',
      subtitle: 'The Port of Pour — A Voyage of Taste and Spirit',
      datetime: '9 JAN 2026 | SHANGRI-LA BANGKOK HOTEL | 18:00–22:00',
      description:
        'Raise a glass with KLN at the riverside — a night of glowing horizons, curated pours, and unforgettable connections.',
    },
    form: {
      heading: 'RSVP DETAILS',
      intro:
        'Please confirm your attendance. Your response helps us craft an exquisite evening tailored to every guest.',
      fullName: 'Full Name',
      email: 'Email',
      phone: 'Phone Number',
      company: 'Company / Organization',
      dietary: 'Dietary Requirement',
      dietaryPlaceholder: 'Select a requirement',
      notes: 'Notes / Allergies',
      submit: 'Confirm RSVP',
      submitting: 'Submitting...',
    },
    confirmation: {
      title: 'Reservation Confirmed',
      message:
        'Thank you for joining the voyage. A confirmation has been sent to your email. Present the RSVP ID at reception.',
      dietary: 'Dietary Preference',
      close: 'Close',
    },
    required: 'This field is required.',
    dietaryOptions: [
      { value: 'none', label: 'No special requirement' },
      { value: 'vegetarian', label: 'Vegetarian' },
      { value: 'vegan', label: 'Vegan' },
      { value: 'halal', label: 'Halal' },
      { value: 'gluten-free', label: 'Gluten-free' },
      { value: 'seafood-allergy', label: 'Allergic to seafood' },
      { value: 'other', label: 'Other (please specify in notes)' },
    ],
  },
  th: {
    langLabel: 'ภาษาไทย',
    hero: {
      title: 'งานเลี้ยงปีใหม่ KLN SEAPORT 2026',
      subtitle: 'The Port of Pour — การเดินทางแห่งรสชาติและสุนทรียะ',
      datetime: '9 ม.ค. 2026 | โรงแรมแชงกรี-ลา กรุงเทพฯ | 18:00–22:00',
      description:
        'ร่วมยกแก้วฉลองริมแม่น้ำเจ้าพระยากับ KLN ในค่ำคืนแห่งแสงสี เครื่องดื่มพรีเมียม และมิตรภาพเหนือระดับ',
    },
    form: {
      heading: 'ลงทะเบียนร่วมงาน',
      intro:
        'โปรดยืนยันการเข้าร่วมของท่าน เพื่อให้เราดูแลประสบการณ์สุดพิเศษสำหรับคุณอย่างครบถ้วน',
      fullName: 'ชื่อ-นามสกุล',
      email: 'อีเมล',
      phone: 'เบอร์โทรศัพท์',
      company: 'บริษัท / องค์กร',
      dietary: 'ข้อมูลอาหาร',
      dietaryPlaceholder: 'เลือกข้อมูลอาหาร',
      notes: 'หมายเหตุ / อาหารที่แพ้',
      submit: 'ยืนยันการเข้าร่วม',
      submitting: 'กำลังส่งข้อมูล...',
    },
    confirmation: {
      title: 'ยืนยันการลงทะเบียนแล้ว',
      message:
        'ขอบคุณที่ร่วมออกเดินทางไปกับเรา ระบบได้ส่งอีเมลยืนยันให้ท่านแล้ว กรุณาแสดงรหัส RSVP ที่จุดลงทะเบียน',
      dietary: 'ความต้องการด้านอาหาร',
      close: 'ปิดหน้าต่าง',
    },
    required: 'กรุณากรอกข้อมูล',
    dietaryOptions: [
      { value: 'none', label: 'ไม่มีข้อจำกัด' },
      { value: 'vegetarian', label: 'มังสวิรัติ' },
      { value: 'vegan', label: 'วีแกน' },
      { value: 'halal', label: 'ฮาลาล' },
      { value: 'gluten-free', label: 'ปราศจากกลูเตน' },
      { value: 'seafood-allergy', label: 'แพ้อาหารทะเล' },
      { value: 'other', label: 'อื่น ๆ (โปรดระบุในหมายเหตุ)' },
    ],
  },
};

const INITIAL_FORM = {
  fullName: '',
  email: '',
  phone: '',
  company: '',
  dietary: '',
  notes: '',
};

// Make.com webhook configuration for RSVP logging.
const MAKE_WEBHOOK_URL = 'https://hook.us2.make.com/x9aawrr3jj4tywycns525istq15g5vve';
const MAKE_WEBHOOK_API_KEY = 'URAss7PB8MN-Bw5';

function generateRsvpId(name = '') {
  const initials = name
    .split(' ')
    .map((part) => part[0])
    .filter(Boolean)
    .join('')
    .toUpperCase()
    .slice(0, 3);
  const randomDigits = Math.floor(Math.random() * 9000 + 1000);
  return `KLN-${initials || 'GUEST'}-${randomDigits}`;
}

const shimmeringParticles = Array.from({ length: 14 }, (_, index) => ({
  id: index,
  delay: index * 0.35,
}));

export default function App() {
  const [language, setLanguage] = useState('en');
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmation, setConfirmation] = useState(null);
  const [submissionError, setSubmissionError] = useState('');

  const t = useMemo(() => copy[language], [language]);

  const validate = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = t.required;
    if (!formData.email.trim()) newErrors.email = t.required;
    if (!formData.dietary) newErrors.dietary = t.required;
    return newErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmissionError('');
    const validation = validate();
    if (Object.keys(validation).length) {
      setErrors(validation);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    const rsvpId = generateRsvpId(formData.fullName);
    const payload = {
      ...formData,
      language,
      rsvpId,
      submittedAt: new Date().toISOString(),
      apiKey: MAKE_WEBHOOK_API_KEY,
    };

    try {
      const response = await fetch(MAKE_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        mode: 'cors',
        keepalive: true,
      });

      if (!response.ok) {
        throw new Error(`Webhook responded with status ${response.status}`);
      }

      setConfirmation({
        id: rsvpId,
        dietary: t.dietaryOptions.find((opt) => opt.value === formData.dietary)?.label || formData.dietary,
      });
      setFormData(INITIAL_FORM);
    } catch (error) {
      console.error('RSVP submission failed', error);
      setSubmissionError(
        language === 'en'
          ? 'Something went wrong while sending your RSVP. Please try again or contact the KLN team.'
          : 'ไม่สามารถส่งข้อมูลได้ กรุณาลองใหม่อีกครั้งหรือติดต่อทีมงาน KLN',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const dietaryOptions = t.dietaryOptions;

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="backdrop-veil" aria-hidden="true" />
      <motion.div
        className="pointer-events-none absolute -top-40 left-1/2 h-[580px] w-[580px] -translate-x-1/2 rounded-full liquid-orb mix-blend-screen"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 40, ease: 'linear' }}
      />
      <motion.div
        className="pointer-events-none absolute bottom-[-180px] right-[-140px] h-[420px] w-[420px] rounded-full bg-gradient-to-tr from-amberglass/40 via-copperglow/40 to-cyan-500/30 blur-3xl"
        animate={{ y: [0, -30, 0], scale: [1, 1.06, 1] }}
        transition={{ repeat: Infinity, duration: 20, ease: 'easeInOut' }}
      />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col px-4 py-8 sm:px-6 lg:px-10">
        <header className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-xs uppercase tracking-[0.55em] text-amber-100/70">
            <span className="h-2 w-2 rounded-full bg-amberglass shadow-glow" />
            <span>KLN SEAPORT</span>
            <span className="hidden sm:inline">2026 CELEBRATION</span>
          </div>
          <nav className="language-toggle flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-1.5 py-1 text-xs font-medium text-white/70 shadow-lg shadow-black/20">
            {[
              { code: 'en', label: '🇬🇧 English' },
              { code: 'th', label: '🇹🇭 ไทย' },
            ].map((lang) => (
              <button
                key={lang.code}
                type="button"
                className="rounded-full px-3 py-1"
                aria-pressed={language === lang.code}
                onClick={() => setLanguage(lang.code)}
              >
                {lang.label}
              </button>
            ))}
          </nav>
        </header>

        <main className="relative mt-12 flex flex-1 flex-col gap-12 lg:flex-row">
          <section className="relative flex flex-1 flex-col justify-center overflow-hidden rounded-[38px] p-10 text-center lg:text-left">
            <div className="glass-panel absolute inset-0 rounded-[38px]" aria-hidden="true" />
            <div className="glow-ring" aria-hidden="true" />
            <div className="relative z-10 space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.45em] text-amber-100/80 shadow-glass">
                <span className="h-2 w-2 animate-pulse rounded-full bg-amberglass" />
                <span>Premium Gathering</span>
              </div>
              <h1 className="font-serif text-4xl font-semibold leading-tight text-white drop-shadow-sm sm:text-5xl lg:text-[3.5rem]">
                {t.hero.title}
              </h1>
              <p className="text-lg font-light text-amber-50/90 sm:text-xl">
                {t.hero.subtitle}
              </p>
              <p className="text-sm uppercase tracking-[0.32em] text-amber-100/80">
                {t.hero.datetime}
              </p>
              <p className="max-w-xl text-base text-amber-50/80 lg:text-lg">
                {t.hero.description}
              </p>
            </div>

            <motion.div
              className="hero-shimmer pointer-events-none absolute -right-10 -top-10 h-80 w-80 rounded-full bg-white/10 mix-blend-screen"
              animate={{ rotate: [0, 12, -8, 0] }}
              transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
            />

            <motion.div
              className="pointer-events-none absolute bottom-[-20%] left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-liquid-gradient opacity-80 blur-3xl"
              animate={{ scale: [1, 1.05, 1], rotate: [0, 8, -6, 0] }}
              transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
            />

            <motion.div
              className="pointer-events-none absolute inset-0"
              animate={{ opacity: [0.45, 0.8, 0.45] }}
              transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,231,202,0.18),transparent_55%),radial-gradient(circle_at_80%_30%,rgba(255,176,120,0.25),transparent_55%)]" />
            </motion.div>

            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 opacity-[0.35] mix-blend-screen"
              style={{
                backgroundImage:
                  "url('data:image/svg+xml,%3Csvg width=\'1600\' height=\'800\' viewBox=\'0 0 1600 800\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cdefs%3E%3ClinearGradient id=\'a\' x1=\'0\' y1=\'0\' x2=\'0\' y2=\'1\'%3E%3Cstop offset=\'0%25\' stop-color=\'%23FFCFA1\' stop-opacity=\'0.85\'/%3E%3Cstop offset=\'100%25\' stop-color=\'%2309101A\' stop-opacity=\'0\'/%3E%3C/linearGradient%3E%3C/defs%3E%3Cpath d=\'M0 620 Q60 540 120 610 T240 610 Q300 520 360 600 T480 600 Q540 500 600 590 T720 590 Q780 520 840 590 T960 590 Q1020 520 1080 600 T1200 600 Q1260 520 1320 610 T1440 610 Q1500 540 1560 620 L1600 800 H0 Z\' fill=\'url(%23a)\'/%3E%3Cpath d=\'M140 580 C150 520 180 500 200 520 L210 600 H170 Z\' fill=\'rgba(255,219,174,0.55)\'/%3E%3Cpath d=\'M360 565 C365 505 400 485 420 500 L430 610 H380 Z\' fill=\'rgba(255,219,174,0.45)\'/%3E%3Cpath d=\'M600 570 C610 520 640 500 660 520 L670 610 H620 Z\' fill=\'rgba(255,219,174,0.5)\'/%3E%3Cpath d=\'M860 560 C870 500 910 480 930 500 L940 600 H890 Z\' fill=\'rgba(255,219,174,0.45)\'/%3E%3Cpath d=\'M1100 575 C1110 515 1140 495 1160 515 L1170 605 H1125 Z\' fill=\'rgba(255,219,174,0.5)\'/%3E%3Cpath d=\'M1320 565 C1330 505 1360 485 1380 505 L1390 600 H1350 Z\' fill=\'rgba(255,219,174,0.4)\'/%3E%3C/svg%3E')",
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
                backgroundPosition: 'bottom center',
              }}
              aria-hidden="true"
            />

            <motion.div
              className="pointer-events-none absolute bottom-0 left-0 right-0 flex justify-center gap-6 pb-6"
              animate={{ opacity: [0.3, 0.55, 0.3], y: [0, -8, 0] }}
              transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
            >
              {shimmeringParticles.map((particle) => (
                <motion.span
                  key={particle.id}
                  className="h-2 w-2 rounded-full bg-white/50"
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 4, repeat: Infinity, delay: particle.delay, ease: 'easeInOut' }}
                />
              ))}
            </motion.div>

            <div className="ship-silhouette" aria-hidden="true" />
          </section>

          <section className="relative flex w-full max-w-xl flex-col justify-center rounded-[32px] border border-white/10 bg-white/5 p-8 shadow-2xl shadow-black/40 backdrop-blur-xl lg:max-w-md">
            <h2 className="text-sm uppercase tracking-[0.5em] text-amber-100/80">{t.form.heading}</h2>
            <p className="mt-2 text-sm text-amber-50/80">{t.form.intro}</p>

            <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label htmlFor="fullName" className="form-label">
                  {t.form.fullName}
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  className="form-input"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder={language === 'en' ? 'e.g. Chanida K.' : 'เช่น กนกชนก พ.'}
                  required
                />
                {errors.fullName && <p className="text-sm text-amber-200/80">{errors.fullName}</p>}
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="form-label">
                  {t.form.email}
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className="form-input"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="guest@email.com"
                  required
                />
                {errors.email && <p className="text-sm text-amber-200/80">{errors.email}</p>}
              </div>

              <div className="space-y-2">
                <label htmlFor="phone" className="form-label">
                  {t.form.phone}
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  inputMode="tel"
                  className="form-input"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder={language === 'en' ? '+66 8X XXX XXXX' : 'เช่น 08X XXX XXXX'}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="company" className="form-label">
                  {t.form.company}
                </label>
                <input
                  id="company"
                  name="company"
                  type="text"
                  className="form-input"
                  value={formData.company}
                  onChange={handleChange}
                  placeholder={language === 'en' ? 'KLN Logistics' : 'บริษัท เคแอลเอ็น โลจิสติกส์'}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="dietary" className="form-label">
                  {t.form.dietary}
                </label>
                <select
                  id="dietary"
                  name="dietary"
                  className="form-input bg-midnight/60"
                  value={formData.dietary}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>
                    {t.form.dietaryPlaceholder}
                  </option>
                  {dietaryOptions.map((option) => (
                    <option key={option.value} value={option.value} className="bg-midnight text-white">
                      {option.label}
                    </option>
                  ))}
                </select>
                {errors.dietary && <p className="text-sm text-amber-200/80">{errors.dietary}</p>}
              </div>

              <div className="space-y-2">
                <label htmlFor="notes" className="form-label">
                  {t.form.notes}
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  rows={3}
                  className="form-input resize-none"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder={language === 'en' ? 'Share any allergies or requests' : 'ระบุอาหารที่แพ้หรือความต้องการพิเศษ'}
                />
              </div>

              {submissionError && <p className="text-sm text-amber-200/80">{submissionError}</p>}

              <motion.button
                type="submit"
                disabled={isSubmitting}
                className="group relative mt-6 flex w-full items-center justify-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-amberglass via-copperglow to-amberglass px-6 py-3 text-base font-semibold uppercase tracking-[0.35em] text-midnight shadow-[0_15px_35px_rgba(224,156,95,0.35)] transition hover:shadow-[0_20px_45px_rgba(224,156,95,0.45)] focus:outline-none focus:ring-2 focus:ring-amberglass/70"
                whileHover={{ scale: 1.015 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="absolute inset-0 translate-x-[-100%] bg-white/40 opacity-0 transition group-hover:translate-x-[30%] group-hover:opacity-100" />
                <span className="relative z-10">
                  {isSubmitting ? t.form.submitting : t.form.submit}
                </span>
              </motion.button>
            </form>
          </section>
        </main>
      </div>

      <AnimatePresence>
        {confirmation && (
          <motion.div
            className="confirm-overlay fixed inset-0 z-20 flex items-center justify-center px-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="relative w-full max-w-md overflow-hidden rounded-[32px] border border-white/15 bg-white/5 p-10 text-center shadow-2xl shadow-black/50 backdrop-blur-2xl"
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 120, damping: 16 }}
            >
              <motion.div
                className="absolute -top-24 left-1/2 h-48 w-48 -translate-x-1/2 rounded-full bg-gradient-to-br from-amberglass/50 via-copperglow/40 to-white/20 blur-3xl"
                animate={{ rotate: [0, 25, -15, 0] }}
                transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
                aria-hidden="true"
              />
              <div className="relative z-10 space-y-4">
                <h3 className="font-serif text-3xl text-white">{t.confirmation.title}</h3>
                <p className="text-sm text-amber-50/90">{t.confirmation.message}</p>
                <div className="rounded-3xl border border-white/20 bg-white/10 px-6 py-5">
                  <p className="text-xs uppercase tracking-[0.4em] text-amber-100/70">RSVP ID</p>
                  <p className="mt-2 text-2xl font-semibold text-white">{confirmation.id}</p>
                  <p className="mt-4 text-xs uppercase tracking-[0.4em] text-amber-100/70">{t.confirmation.dietary}</p>
                  <p className="mt-1 text-base text-amber-50">{confirmation.dietary}</p>
                </div>
                <motion.button
                  type="button"
                  className="mt-6 inline-flex items-center justify-center rounded-full border border-white/30 bg-white/10 px-6 py-2 text-sm font-semibold uppercase tracking-[0.3em] text-white transition hover:bg-white/20"
                  onClick={() => setConfirmation(null)}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  {t.confirmation.close}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
