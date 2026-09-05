/**
 * المتحدة بلس - Al-Mutahida Plus
 * الكود البرمجي الرئيسي للتفاعل وتوجيه الواتساب والفلاتر والمودال
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeaderScroll();
  initMobileMenu();
  initPhoneDropdown();
  initProductFilters();
  initQuoteForm();
  initCounters();
  initScrollTop();
  initProductModals();
  initOrderModal();
});

// أرقام الهاتف والواتساب الرسمية للمبيعات
const OFFICIAL_PHONE = "01011380713";
const OFFICIAL_PHONE_2 = "01017228139";
const WHATSAPP_INT_NUMBER = "201011380713";
const WHATSAPP_INT_NUMBER_2 = "201017228139";

/* --------------------------------------------------------------------------
   قائمة الهواتف المنسدلة في الهيدر (Phone Dropdown)
   -------------------------------------------------------------------------- */
function initPhoneDropdown() {
  const dropdowns = document.querySelectorAll('.header-phone-dropdown');
  dropdowns.forEach(dropdown => {
    const trigger = dropdown.querySelector('.phone-dropdown-trigger');
    if (!trigger) return;

    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      const isActive = dropdown.classList.contains('active');
      dropdowns.forEach(d => {
        d.classList.remove('active');
        d.querySelector('.phone-dropdown-trigger')?.setAttribute('aria-expanded', 'false');
      });
      if (!isActive) {
        dropdown.classList.add('active');
        trigger.setAttribute('aria-expanded', 'true');
      }
    });
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.header-phone-dropdown')) {
      dropdowns.forEach(d => {
        d.classList.remove('active');
        d.querySelector('.phone-dropdown-trigger')?.setAttribute('aria-expanded', 'false');
      });
    }
  });
}

/* --------------------------------------------------------------------------
   الهيدر عند التمرير (Sticky Header)
   -------------------------------------------------------------------------- */
function initHeaderScroll() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });
}

/* --------------------------------------------------------------------------
   قائمة الموبايل (Mobile Drawer)
   -------------------------------------------------------------------------- */
function initMobileMenu() {
  const toggleBtn = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!toggleBtn || !navMenu) return;

  toggleBtn.addEventListener('click', () => {
    navMenu.classList.toggle('open');
    const isOpen = navMenu.classList.contains('open');
    toggleBtn.innerHTML = isOpen ? '<i class="fa-solid fa-xmark"></i>' : '<i class="fa-solid fa-bars"></i>';
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      toggleBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
    });
  });
}

/* --------------------------------------------------------------------------
   فلترة المنتجات حسب التصنيف (Product Tabs Filter)
   -------------------------------------------------------------------------- */
function initProductFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const productCards = document.querySelectorAll('.product-card');

  if (!filterBtns.length || !productCards.length) return;

  function applyFilter(filterValue, shouldScroll = false) {
    filterBtns.forEach(b => {
      if (b.getAttribute('data-filter') === filterValue) {
        b.classList.add('active');
      } else {
        b.classList.remove('active');
      }
    });

    productCards.forEach(card => {
      const category = card.getAttribute('data-category');
      if (filterValue === 'all' || category === filterValue) {
        card.style.display = 'flex';
        setTimeout(() => {
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        }, 50);
      } else {
        card.style.opacity = '0';
        card.style.transform = 'translateY(15px)';
        setTimeout(() => {
          card.style.display = 'none';
        }, 200);
      }
    });

    if (shouldScroll) {
      const grid = document.querySelector('.products-grid');
      const filterBar = document.querySelector('.products-filter-bar');
      const targetElement = filterBar || grid;
      if (targetElement) {
        const yOffset = -90; // مسافة تعويض الهيدر الثابت
        const y = targetElement.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filterValue = btn.getAttribute('data-filter');
      applyFilter(filterValue, true);
    });
  });

  // فحص معلمات الرابط URL (e.g. products.html?category=vertical-tanks)
  const urlParams = new URLSearchParams(window.location.search);
  const categoryParam = urlParams.get('category');
  if (categoryParam && ['vertical-tanks', 'horizontal-tanks', 'tanks', 'barriers', 'kiosks'].includes(categoryParam)) {
    applyFilter(categoryParam === 'tanks' ? 'vertical-tanks' : categoryParam, true);
  }
}

function sendWhatsAppOrder(productName, specs = '') {
  openOrderModal(productName, specs);
}

function openOrderModal(productName, specs = '') {
  const modal = document.getElementById('orderModal');
  const prodInput = document.getElementById('orderProductName');
  if (prodInput) {
    prodInput.value = specs ? `${productName} (${specs})` : productName;
  }
  if (modal) {
    modal.classList.add('active');
    const nameInput = document.getElementById('orderCustomerName');
    if (nameInput) setTimeout(() => nameInput.focus(), 150);
  }
}

function initOrderModal() {
  const modal = document.getElementById('orderModal');
  if (!modal) return;

  const form = document.getElementById('productOrderForm');
  const closeBtn = document.getElementById('closeOrderModalBtn');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const product = document.getElementById('orderProductName')?.value || 'منتج من المتحدة بلس';
      const name = document.getElementById('orderCustomerName')?.value || 'عميل كريم';
      const phone = document.getElementById('orderCustomerPhone')?.value || '';
      const address = document.getElementById('orderCustomerAddress')?.value || 'غير محدد';
      const notes = document.getElementById('orderCustomerNotes')?.value || 'لا توجد ملاحظات إضافية';

      const message = `*طلب شراء وتوريد منتج - مصنع المتحدة بلس*
📦 *المنتج المطلوب:* ${product}
👤 *الاسم الكريم:* ${name}
📞 *رقم الهاتف:* ${phone}
📍 *العنوان:* ${address}
📝 *تفاصيل إضافية:* ${notes}

يرجى تزويدي بالأسعار ومواعيد التوريد المتاحة. شكراً لكم.`;

      const encodedMsg = encodeURIComponent(message);
      const waUrl = `https://wa.me/${WHATSAPP_INT_NUMBER}?text=${encodedMsg}`;
      window.open(waUrl, '_blank');

      modal.classList.remove('active');
      form.reset();
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      modal.classList.remove('active');
    });
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('active');
    }
  });
}

/* --------------------------------------------------------------------------
   نموذج حاسبة الأسعار السريعة (Quote Calculator Form)
   -------------------------------------------------------------------------- */
function initQuoteForm() {
  const form = document.getElementById('quickQuoteForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('quoteName')?.value || 'عميل كريم';
    const phone = document.getElementById('quotePhone')?.value || '';
    const productType = document.getElementById('quoteProductType')?.value || 'منتجات عامة';
    const quantity = document.getElementById('quoteQuantity')?.value || '1';
    const city = document.getElementById('quoteCity')?.value || 'القاهرة / القليوبية';
    const notes = document.getElementById('quoteNotes')?.value || 'لا توجد ملاحظات إضافية';

    const message = `*طلب عرض سعر جديد - المتحدة بلس*
👤 *الاسم:* ${name}
📞 *رقم الهاتف:* ${phone}
🏭 *نوع المنتج المطلوب:* ${productType}
🔢 *الكمية:* ${quantity}
📍 *مكان التوريد (المحافظة/المدينة):* ${city}
📝 *ملاحظات:* ${notes}`;

    const encodedMsg = encodeURIComponent(message);
    const waUrl = `https://wa.me/${WHATSAPP_INT_NUMBER}?text=${encodedMsg}`;
    window.open(waUrl, '_blank');
  });
}

/* --------------------------------------------------------------------------
   عدادات الإحصائيات الحية (Live Counter Animation)
   -------------------------------------------------------------------------- */
function initCounters() {
  const counters = document.querySelectorAll('.stat-number');
  if (!counters.length) return;

  let animated = false;

  const handleScroll = () => {
    const section = document.querySelector('.stats-strip');
    if (!section) return;

    const rect = section.getBoundingClientRect();
    if (rect.top <= window.innerHeight * 0.85 && !animated) {
      animated = true;
      counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target') || '0', 10);
        const prefix = counter.getAttribute('data-prefix') || '';
        const suffix = counter.getAttribute('data-suffix') || '';
        let count = 0;
        const speed = target / 50;

        const updateCount = () => {
          count += speed;
          if (count < target) {
            counter.innerText = `${prefix}${Math.ceil(count).toLocaleString('en-US')}${suffix}`;
            requestAnimationFrame(updateCount);
          } else {
            counter.innerText = `${prefix}${target.toLocaleString('en-US')}${suffix}`;
          }
        };
        updateCount();
      });
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/* --------------------------------------------------------------------------
   زر الصعود للأعلى (Scroll To Top)
   -------------------------------------------------------------------------- */
function initScrollTop() {
  const btn = document.querySelector('.scroll-top-btn');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* --------------------------------------------------------------------------
   نافذة تفاصيل ومواصفات المنتج (Product Specs Modal)
   -------------------------------------------------------------------------- */
const productDatabase = {
  'tank-horiz-500': {
    title: 'خزان فايبر جلاس أفقي 500 لتر',
    category: 'خزانات أفقية',
    image: 'images/products/tank-horiz-500.webp',
    specs: [
      { label: 'السعة', value: '500 لتر' },
      { label: 'التصميم والهيكل', value: 'تصميم أسطواني أفقي معزز بأضلاع دائرية وقواعد تثبيت مدمجة' },
      { label: 'الخامة', value: 'فايبر جلاس نقي غذائي صالح لمياه الشرب ومقاوم للحرارة والشمس' },
      { label: 'الضمان', value: '10 سنوات ضمان معتمد من المصنع' }
    ]
  },
  'tank-horiz-1000': {
    title: 'خزان فايبر جلاس أفقي 1,000 لتر',
    category: 'خزانات أفقية',
    image: 'images/products/tank-horiz-1000.webp',
    specs: [
      { label: 'السعة', value: '1,000 لتر (1 متر مكعب)' },
      { label: 'اللون والتصميم', value: 'تصميم أفقي أزرق بحلقات تقوية هيكلية لمنع التشوه والاهتزاز' },
      { label: 'الاستخدام', value: 'أسطح المنازل، المزارع، ومواقع العمل لتخزين مياه الشرب والري' },
      { label: 'الضمان', value: '10 سنوات مع خدمة التوصيل الفوري' }
    ]
  },
  'tank-horiz-2000': {
    title: 'خزان فايبر جلاس أفقي 2,000 لتر',
    category: 'خزانات أفقية',
    image: 'images/products/tank-horiz-2000.webp',
    specs: [
      { label: 'السعة', value: '2,000 لتر (2 متر مكعب)' },
      { label: 'القواعد والتثبيت', value: 'أرجل وقواعد تثبيت هندسية صلبة مناسبة للقواعد الخرسانية' },
      { label: 'الفتحات والمحابس', value: 'غطاء فلانشة محكم وفتحات تصريف وتغذية بأعلى معايير الأمان' },
      { label: 'الضمان', value: '10 سنوات ضمان شامل' }
    ]
  },
  'tank-horiz-3000': {
    title: 'خزان فايبر جلاس أفقي 3,000 لتر',
    category: 'خزانات أفقية',
    image: 'images/products/tank-horiz-3000.webp',
    specs: [
      { label: 'السعة', value: '3,000 لتر (3 متر مكعب)' },
      { label: 'الخامة', value: 'فايبر جلاس أبيض نقي متعدد الطبقات عازل للحرارة والضوء' },
      { label: 'الاستخدامات', value: 'المشروعات والمصانع والشبكات المركزية والمجمعات السكنية' },
      { label: 'الضمان', value: '10 سنوات مع خدمة الإشراف الهندسي' }
    ]
  },
  'tank-horiz-5000': {
    title: 'خزان فايبر جلاس أفقي 5,000 لتر',
    category: 'خزانات أفقية',
    image: 'images/products/tank-horiz-5000.webp',
    specs: [
      { label: 'السعة', value: '5,000 لتر (5 متر مكعب)' },
      { label: 'المتانة ومقاومة الضغط', value: 'سعة كبرى معززة بجدران سميكة تتحمل ضغوط السوائل والكيماويات' },
      { label: 'الملاءمة', value: 'محطات المياه والمزارع الكبرى والمصانع وشبكات الإطفاء' },
      { label: 'الضمان', value: '10 سنوات ضمان رسمي من مصنع المتحدة بلس' }
    ]
  },
  'tank-horiz-10000': {
    title: 'خزان فايبر جلاس أفقي 10,000 لتر',
    category: 'خزانات أفقية',
    image: 'images/products/tank-horiz-10000.webp',
    specs: [
      { label: 'السعة', value: '10,000 لتر (10 متر مكعب)' },
      { label: 'التجهيزات والمحابس', value: 'مزود بمحابس وصمامات تفريغ نحاسية عالية الجودة وفتحة علوية محكمة' },
      { label: 'الاستخدام', value: 'تخزين مياه الشرب، المزارع والري، والمصانع والمحطات المركزية' },
      { label: 'الضمان', value: '10 سنوات ضمان شامل من المصنع' }
    ]
  },
  'tank-horiz-20000': {
    title: 'خزان فايبر جلاس أفقي 20,000 لتر عملاق',
    category: 'خزانات أفقية',
    image: 'images/products/tank-horiz-20000.webp',
    specs: [
      { label: 'السعة', value: '20,000 لتر (20 متر مكعب)' },
      { label: 'القوة والتدعيم', value: 'هيكل عملاق متعدد الطبقات بأضلاع تقوية مكثفة وأرجل تثبيت صلبة' },
      { label: 'المشروعات الكبرى', value: 'شبكات مكافحة الحريق، المجمعات السكنية، ومحطات معالجة المياه' },
      { label: 'الضمان', value: '10 سنوات مع خدمة التوريد والإشراف على التركيب' }
    ]
  },
  'tank-vert-500': {
    title: 'خزان رأسي فايبر جلاس 500 لتر',
    category: 'خزانات رأسية',
    image: 'images/products/tank-vert-500.webp',
    specs: [
      { label: 'السعة', value: '500 لتر' },
      { label: 'الخامة', value: 'فايبر جلاس بيور متعدد الطبقات معزول ضد الطحالب والبكتيريا' },
      { label: 'القاعدة والتثبيت', value: 'قاعدة مسطحة متينة سهلة التثبيت على الأسطح والحدائق' },
      { label: 'الضمان', value: '10 سنوات ضمان معتمد من المصنع' }
    ]
  },
  'tank-vert-1000': {
    title: 'خزان رأسي فايبر جلاس 1,000 لتر',
    category: 'خزانات رأسية',
    image: 'images/products/tank-vert-1000.webp',
    specs: [
      { label: 'السعة', value: '1,000 لتر' },
      { label: 'الخامة والاعتماد', value: 'فايبر جلاس نقي غذائي مطابق لاشتراطات مياه الشرب' },
      { label: 'مقاومة الشمس', value: 'حماية كاملة من أشعة الشمس والأشعة فوق البنفسجية UV' },
      { label: 'الضمان', value: '10 سنوات مع خدمة التوصيل الفوري' }
    ]
  },
  'tank-vert-1500': {
    title: 'خزان رأسي فايبر جلاس 1,500 لتر',
    category: 'خزانات رأسية',
    image: 'images/products/tank-vert-1500.webp',
    specs: [
      { label: 'السعة', value: '1,500 لتر' },
      { label: 'التصميم الهندسي', value: 'أسطواني رأسي معزز بحلقات تقوية لمقاومة ضغط السوائل' },
      { label: 'العزل الحراري', value: 'عازل حراري ممتاز يحافظ على اعتدال درجة حرارة المياه' },
      { label: 'الضمان', value: '10 سنوات شامل الصيانة' }
    ]
  },
  'tank-vert-2000': {
    title: 'خزان رأسي فايبر جلاس 2,000 لتر',
    category: 'خزانات رأسية',
    image: 'images/products/tank-vert-2000.webp',
    specs: [
      { label: 'السعة', value: '2,000 لتر' },
      { label: 'الخامة', value: 'فايبر جلاس مسلح عالي الكثافة فائق المتانة' },
      { label: 'الاستخدام', value: 'الفلل والعمائر السكنية والمنشآت التجارية والمصانع' },
      { label: 'الضمان', value: '10 سنوات ضمان معتمد' }
    ]
  },
  'tank-vert-3000': {
    title: 'خزان رأسي فايبر جلاس 3,000 لتر',
    category: 'خزانات رأسية',
    image: 'images/products/tank-vert-3000.webp',
    specs: [
      { label: 'السعة', value: '3,000 لتر (3 متر مكعب)' },
      { label: 'الهيكل والتدعيم', value: 'تصميم رأسي معزز بأضلاع دائرية متعددة لمقاومة أعلى ضغط' },
      { label: 'العزل', value: 'عزل حراري ومقاومة تامة لأشعة الشمس المباشرة' },
      { label: 'الضمان', value: '10 سنوات مع خدمة التوريد والتركيب' }
    ]
  },
  'tank-vert-5000': {
    title: 'خزان رأسي فايبر جلاس 5,000 لتر',
    category: 'خزانات رأسية',
    image: 'images/products/tank-vert-5000.webp',
    specs: [
      { label: 'السعة', value: '5,000 لتر (5 متر مكعب)' },
      { label: 'الخامة', value: 'فايبر جلاس صناعي نقي عالي السماكة والمتانة' },
      { label: 'المواصفات', value: 'طبقة داخلية ملساء بيضاء تمنع ترسب البكتيريا والطحالب' },
      { label: 'الضمان', value: '10 سنوات ضمان شامل' }
    ]
  },
  'tank-vert-7500': {
    title: 'خزان رأسي فايبر جلاس 7,500 لتر مجهز',
    category: 'خزانات رأسية',
    image: 'images/products/tank-vert-7500.webp',
    specs: [
      { label: 'السعة', value: '7,500 لتر (7.5 متر مكعب)' },
      { label: 'التجهيزات المدمجة', value: 'مزود بمؤشر قياس منسوب المياه الخارجي وصمامات ومحابس نحاسية' },
      { label: 'الاستخدام', value: 'المصانع، المزارع، الفنادق، ومحطات معالجة المياه' },
      { label: 'الضمان', value: '10 سنوات مع خدمة المعاينة والتوصيل' }
    ]
  },
  'tank-vert-10000': {
    title: 'خزان رأسي فايبر جلاس 10,000 لتر',
    category: 'خزانات رأسية',
    image: 'images/products/tank-vert-10000.webp',
    specs: [
      { label: 'السعة', value: '10,000 لتر (10 متر مكعب)' },
      { label: 'التصميم والفتحات', value: 'فتحة صيانة علوية كبيرة بغطاء محكم ومخارج سفلية متعددة الأقطار' },
      { label: 'المتانة', value: 'تحمل فائق للظروف المناخية القاسية والأحماض والكيماويات' },
      { label: 'الضمان', value: '10 سنوات ضمان رسمي' }
    ]
  },
  'tank-vert-15000': {
    title: 'خزان رأسي فايبر جلاس 15,000 لتر عملاق',
    category: 'خزانات رأسية',
    image: 'images/products/tank-vert-15000.webp',
    specs: [
      { label: 'السعة', value: '15,000 لتر (15 متر مكعب)' },
      { label: 'الخامة والقوة', value: 'هيكل فايبر جلاس صناعي فائق السماكة معزز بأطواق أمان إضافية' },
      { label: 'الاستخدامات', value: 'المشروعات الكبرى، شبكات مكافحة الحريق، والقرى السياحية' },
      { label: 'الضمان', value: '10 سنوات شامل الدعم الفني' }
    ]
  },
  'tank-vert-20000': {
    title: 'خزان رأسي فايبر جلاس 20,000 لتر',
    category: 'خزانات رأسية',
    image: 'images/products/tank-vert-20000.webp',
    specs: [
      { label: 'السعة', value: '20,000 لتر (20 متر مكعب)' },
      { label: 'الهيكل والتدعيم', value: 'تصميم رأسي صناعي فائق المتانة مزود بحلقات تدعيم هندسية ومحبس تصريف نحاسي' },
      { label: 'الاستخدام', value: 'المصانع والمحطات والمجمعات السكنية الكبرى وشبكات الإطفاء' },
      { label: 'الضمان', value: '10 سنوات ضمان شامل من المصنع' }
    ]
  },
  'tank-vert-30000': {
    title: 'خزان رأسي فايبر جلاس 30,000 لتر عملاق',
    category: 'خزانات رأسية',
    image: 'images/products/tank-vert-30000.webp',
    specs: [
      { label: 'السعة', value: '30,000 لتر (30 متر مكعب)' },
      { label: 'الخامة والأمان', value: 'أعلى مواصفات الفايبر جلاس المسلح متعدد الطبقات المقاوم لأقصى ضغوط السوائل' },
      { label: 'التجهيزات', value: 'فتحة دخول وصيانة علوية واسعة، صمامات دخول وخروج مخصصة حسب الطلب' },
      { label: 'الضمان', value: '10 سنوات مع خدمة التوريد والتركيب والإشراف الهندسي' }
    ]
  },
  'tank-fish-pond-1000': {
    title: 'حوض مزارع سمكية فايبر جلاس 1,000 لتر',
    category: 'أحواض استزراع سمكي',
    image: 'images/products/tank-fish-pond-1000.webp',
    specs: [
      { label: 'السعة والشكل', value: '1,000 لتر - حوض دائري مفتوح أزرق ملكي' },
      { label: 'الخامة والأمان', value: 'فايبر جلاس أملس غير سام وآمن 100% للأسماك والأحياء المائية' },
      { label: 'المقاومة الكيميائية', value: 'مقاوم تام للأملاح وتغيرات الطقس والتآكل وسهل التنظيف' },
      { label: 'مجالات الاستخدام', value: 'مشاريع الاستزراع السمكي، التفريخ، وتسمين وتربية الأحياء المائية' }
    ]
  },
  'barrier-orange-line': {
    title: 'حواجز أمان نيوجيرسي متصلة - برتقالي',
    category: 'حواجز الأمان والمرور',
    image: 'images/products/barrier-orange-line.webp',
    specs: [
      { label: 'نوع الحاجز', value: 'حواجز نيوجيرسي مرورية متصلة بنظام تعشيق ترادفي' },
      { label: 'الخامة والتصنيع', value: 'بوليمر بولي إيثيلين وفايبر جلاس عالي الكثافة HDPE معالج ضد الأشعة فوق البنفسجية UV' },
      { label: 'التثبيت والوزن', value: 'نظام تعشيق متداخل قوي، وتملأ بالماء أو الرمال للوصول لأقصى وزن وثبات' },
      { label: 'الرؤية والسلامة', value: 'شرائط فسفورية عاكسة للضوء للرؤية الليلية وشعار المتحدة بلس المعتمد' },
      { label: 'الاستخدامات', value: 'تأمين تحويلات الطرق، المشروعات القومية، المواقع الإنشائية، والكمبوندات' }
    ]
  },
  'barrier-blue-single': {
    title: 'حاجز أمان نيوجيرسي مروري - أزرق',
    category: 'حواجز الأمان والمرور',
    image: 'images/products/barrier-blue-single.webp',
    specs: [
      { label: 'الأبعاد والتصميم', value: 'حاجز نيوجيرسي مفرد بتصميم هندسي ممتص للصدمات' },
      { label: 'الخامة', value: 'بولي إيثيلين نقي عالي المقاومة للصدمات والعوامل الجوية' },
      { label: 'منافذ التعبئة والتصريف', value: 'فتحة تعبئة علوية بغطاء محكم وصمام سفلي لتفريغ المياه بسهولة' },
      { label: 'الرؤية الليلية', value: 'شرائط عاكسة مطابقة للمواصفات المرورية القياسية' },
      { label: 'الاستخدام', value: 'تنظيم بوابات الدخول، المواقف، تحويلات المسارات، والمناطق الصناعية' }
    ]
  },
  'barrier-blue-line': {
    title: 'حواجز أمان نيوجيرسي متصلة - أزرق',
    category: 'حواجز الأمان والمرور',
    image: 'images/products/barrier-blue-line.webp',
    specs: [
      { label: 'نوع الحاجز', value: 'سلسلة حواجز نيوجيرسي متصلة ومتراصة باللون الأزرق' },
      { label: 'نظام الربط', value: 'مفصلات تعشيق قوية تتيح التوصيل في خطوط مستقيمة أو منحنيات الطرق' },
      { label: 'الثبات والأمان', value: 'ثبات فائق على الأسفلت بعد التعبئة ومقاوم للصدمات الشديدة' },
      { label: 'الضمان والاعتماد', value: 'معتمد ومطابق لاشتراطات السلامة والصحة المهنية وهيئة الطرق' }
    ]
  },
  'kiosk-round-dome': {
    title: 'كشك حراسة فايبر جلاس دائري بقبة زرقاء',
    category: 'أكشاك وكبائن الحراسة',
    image: 'images/products/kiosk-round-dome.webp',
    specs: [
      { label: 'الشكل والتصميم', value: 'تصميم دائري كروي بقبة علوية زرقاء مميزة وباب زجاجي مقوس' },
      { label: 'الخامة والعزل', value: 'فايبر جلاس بيور مزدوج معزول حرارياً وصوتياً بنسبة 100%' },
      { label: 'الرؤية والتهوية', value: 'نوافذ ألوميتال زجاجية بانورامية بزاوية رؤية محيطية واسعة' },
      { label: 'الاستخدام', value: 'البوابات الرئيسية، المجمعات السكنية، الهيئات، والمنشآت الحيوية' }
    ]
  },
  'kiosk-faceted-blue': {
    title: 'كشك حراسة فايبر جلاس مضلع بسقف هرمي',
    category: 'أكشاك وكبائن الحراسة',
    image: 'images/products/kiosk-faceted-blue.webp',
    specs: [
      { label: 'التصميم الهندسي', value: 'هيكل مضلع ثماني الأضلاع مع سقف هرمي مائل لتصريف مياه الأمطار' },
      { label: 'الأبواب والنوافذ', value: 'باب ألوميتال مزود بزجاج وكالون أمان ونوافذ مراقبة متعددة الاتجاهات' },
      { label: 'التحمل', value: 'مقاوم تام للشمس والحرارة الشديدة والرياح والأمطار وضمان 10 سنوات' },
      { label: 'الاستخدامات', value: 'مداخل القرى السياحية، الفنادق، المصانع، والشركات' }
    ]
  },
  'kiosk-square-cottage': {
    title: 'كابينة أمن واستقبال فايبر جلاس بسقف قرميدي',
    category: 'أكشاك وكبائن الحراسة',
    image: 'images/products/kiosk-square-cottage.webp',
    specs: [
      { label: 'الشكل والستايل', value: 'كابينة أمن فاخرة طراز Cottage بسقف قرميدي جمالي مقاوم للعوامل الجوية' },
      { label: 'المساحة الداخلية', value: 'مساحة واسعة مجهزة لإضافة مقعد ومكتب استقبال ونقاط كهرباء' },
      { label: 'العزل والدهان', value: 'طبقات جل كوت فائقة اللمعان ومقاومة للبهتان والأشعة فوق البنفسجية' },
      { label: 'الملاءمة', value: 'الكمبوندات السكنية الراقية، المنتجعات، والنوادي الرياضية' }
    ]
  },
  'kiosk-square-modern': {
    title: 'كشك حراسة فايبر جلاس مربع مودرن',
    category: 'أكشاك وكبائن الحراسة',
    image: 'images/products/kiosk-square-modern.webp',
    specs: [
      { label: 'الأبعاد والتصميم', value: 'تصميم مربع مودرن مع سقف مائل ممتد للأمام وإطارات زرقاء أنيقة' },
      { label: 'التجهيز', value: 'باب ألوميتال محكم وشبابيك منزلقة مع قفل أمان ومكان مخصص للإضاءة' },
      { label: 'المتانة', value: 'قاعدة فايبر جلاس صلبة ومقاومة للرطوبة وتآكل الأرضيات' },
      { label: 'الاستخدام', value: 'مواقف السيارات، البوابات الأمنية، المشروعات الإنشائية' }
    ]
  },
  'kiosk-round-open': {
    title: 'كابينة حراسة واستراحة دائرية مفتوحة',
    category: 'أكشاك وكبائن الحراسة',
    image: 'images/products/kiosk-round-open.webp',
    specs: [
      { label: 'التصميم', value: 'كابينة دائرية مفتوحة المدخل بقبة زرقاء ومقعد جلوس داخلي مدمج' },
      { label: 'الوظيفة', value: 'مخصصة لنقاط الحراسة السريعة، استراحات الأفراد، ونقاط التفتيش الدورية' },
      { label: 'الخامة', value: 'فايبر جلاس مصقول فائق المتانة سهل التنظيف والغسيل ومقاوم للشمس' },
      { label: 'المقاس', value: 'تصميم مدمج يوفر سهولة النقل والتركيب الفوري في أي موقع' }
    ]
  },
  'kiosk-round-beige': {
    title: 'كشك حراسة فايبر جلاس دائري - بيج كلاسيك',
    category: 'أكشاك وكبائن الحراسة',
    image: 'images/products/kiosk-round-beige.webp',
    specs: [
      { label: 'التصميم واللون', value: 'كروي دائري بقبة أنيقة باللون البيج الملكي المتناسق مع الواجهات المعمارية' },
      { label: 'الأبواب والنوافذ', value: 'باب مقوس عالي الجودة مزود بكالون أمان ونوافذ ألوميتال زجاجية' },
      { label: 'العزل', value: 'عازل للحرارة والصوت بنسبة 100% ومقاوم لتغيرات الطقس' },
      { label: 'الاستخدام', value: 'القصور، الفلل، الفنادق، والشركات والمجمعات الإدارية' }
    ]
  },
  'kiosk-square-orange': {
    title: 'كشك حراسة مربع بإطار برتقالي وباب مقوس',
    category: 'أكشاك وكبائن الحراسة',
    image: 'images/products/kiosk-square-orange.webp',
    specs: [
      { label: 'التصميم والألوان', value: 'تصميم مربع مميز بإطارات وباب مقوس باللون البرتقالي الجذاب' },
      { label: 'التجهيزات', value: 'باب ألوميتال متين بنصف زجاجي ونوافذ سحاب للمراقبة الميدانية' },
      { label: 'القاعدة', value: 'قاعدة فايبر جلاس صلبة ومرفوعة لحماية الكشك من مياه الأمطار' },
      { label: 'الاستخدامات', value: 'المواقف، محطات الوقود، بوابات التفتيش، والمشروعات' }
    ]
  },
  'kiosk-square-large-cottage': {
    title: 'كابينة أمن واستقبال عريضة بسقف قرميدي',
    category: 'أكشاك وكبائن الحراسة',
    image: 'images/products/kiosk-square-large-cottage.webp',
    specs: [
      { label: 'الأبعاد والمساحة', value: 'كابينة استقبال وأمن عريضة تتسع لمكتب متكامل وأجهزة المراقبة والحاسب' },
      { label: 'الستايل', value: 'سقف قرميدي نبيتي فاخر طراز Cottage المقاوم لأشعة الشمس والرياح' },
      { label: 'النوافذ', value: 'نوافذ ألوميتال متعددة الاتجاهات تتيح رؤية بانورامية شاملة' },
      { label: 'الضمان', value: '10 سنوات ضمان رسمي من مصنع المتحدة بلس' }
    ]
  },
  'kiosk-square-green': {
    title: 'كشك حراسة مربع بإطار وسقف قرميدي أخضر',
    category: 'أكشاك وكبائن الحراسة',
    image: 'images/products/kiosk-square-green.webp',
    specs: [
      { label: 'الشكل واللون', value: 'تصميم أنيق بسقف قرميدي وإطارات باللون الأخضر المميز المتناسق مع الحدائق' },
      { label: 'التجهيزات الكهربائية', value: 'مزود بمأخذ كهربائي خارجي، إنارة داخلية، وشبابيك سحاب' },
      { label: 'المتانة', value: 'فايبر جلاس معالج ضد التآكل والأمطار وأشعة الشمس الحارقة' },
      { label: 'الملاءمة', value: 'الحدائق، النوادي، المشروعات الزراعية، والمداخل السكنية' }
    ]
  },
  'kiosk-wc-portable': {
    title: 'كابينة حمام متنقل W.C فايبر جلاس مجهزة',
    category: 'أكشاك وكبائن الحراسة',
    image: 'images/products/kiosk-wc-portable.webp',
    specs: [
      { label: 'نوع الكابينة', value: 'دورة مياه متنقلة W.C كاملة التجهيزات الصحية من الفايبر جلاس البيور' },
      { label: 'التجهيزات الداخلية', value: 'تجهيزات صرف وتغذية مياه جاهزة، حوض، إضاءة، وتهوية' },
      { label: 'القواعد والتحريك', value: 'قوائم حديدية سفلية مجهزة للرفع والتحريك السريع بالرافعة الشوكية' },
      { label: 'المجالات', value: 'المواقع الإنشائية، المشروعات القومية، الفعاليات الخارجية، والشواطئ' }
    ]
  }
};

function initProductModals() {
  const modal = document.getElementById('productDetailsModal');
  if (!modal) return;

  const closeBtn = modal.querySelector('.modal-close-btn');
  const modalBody = modal.querySelector('.modal-body');

  // فتح المودال عند الضغط على زر التفاصيل
  document.querySelectorAll('.btn-view-details').forEach(btn => {
    btn.addEventListener('click', () => {
      const productId = btn.getAttribute('data-product-id');
      const data = productDatabase[productId];
      if (!data) return;

      let specsHtml = data.specs.map(s => `
        <div style="display:flex; justify-content:space-between; padding:10px 0; border-bottom:1px solid #f1f5f9; font-size:0.92rem;">
          <strong style="color:var(--color-primary);">${s.label}:</strong>
          <span style="color:#475569;">${s.value}</span>
        </div>
      `).join('');

      modalBody.innerHTML = `
        <div style="text-align:center; margin-bottom:20px;">
          <img src="${data.image}" alt="${data.title}" style="max-height:220px; margin:0 auto 16px auto; object-fit:contain;">
          <span style="display:inline-block; font-size:0.8rem; font-weight:700; color:var(--color-accent); background:var(--color-accent-light); padding:4px 14px; border-radius:9999px; margin-bottom:8px;">${data.category}</span>
          <h3 style="font-family:var(--font-heading); font-size:1.4rem; font-weight:800; color:var(--color-primary);">${data.title}</h3>
        </div>
        <div style="margin-bottom:25px;">
          <h4 style="font-family:var(--font-heading); font-size:1rem; font-weight:800; color:var(--color-primary); margin-bottom:12px; border-bottom:2px solid var(--color-accent); padding-bottom:6px; display:inline-block;">المواصفات الفنية المعتمدة</h4>
          <div style="background:#f8fafc; border-radius:12px; padding:16px; border:1px solid #e2e8f0;">
            ${specsHtml}
          </div>
        </div>
        <button onclick="document.getElementById('productDetailsModal').classList.remove('active'); openOrderModal('${data.title}', 'المواصفات الفنية المعتمدة');" style="width:100%; padding:14px; background:linear-gradient(135deg, #25d366 0%, #16a34a 100%); color:#fff; border:none; border-radius:14px; font-family:var(--font-heading); font-weight:800; font-size:1.05rem; display:flex; align-items:center; justify-content:center; gap:10px; cursor:pointer; box-shadow:0 6px 20px rgba(37,211,102,0.35);">
          <i class="fa-brands fa-whatsapp" style="font-size:1.3rem;"></i>
          طلب هذا المنتج الآن عبر واتساب
        </button>
      `;

      modal.classList.add('active');
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      modal.classList.remove('active');
    });
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('active');
    }
  });
}
