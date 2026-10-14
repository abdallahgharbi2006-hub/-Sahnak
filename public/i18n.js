// نظام الترجمة الرباعي (عربي/إنجليزي/فرنسي/تركي) المشترك بين كل صفحات صحنك
(function(){
const DICT = {
ar: { dir:'rtl', logo:'صحنك',
  nav_login:'تسجيل الدخول / إنشاء حساب',
  home_title:'حوّل قائمة مطعمك إلى منيو رقمية بلمسات بسيطة',
  home_sub:'أنشئ حسابًا خاصًا بك، ابنِ منيو مطعمك، وشارك رابطًا ورمز QR يفتحه الزبون من هاتفه مباشرة. لا حاجة لإعادة الطباعة أبدًا.',
  home_cta:'ابدأ الآن',
  stat1:'0', stat1_l:'إعادة طباعة بعد اليوم',
  stat2:'دقائق', stat2_l:'لإنشاء منيو كامل',
  stat3:'24/7', stat3_l:'منيو متاح دائمًا للزبون',
  why_title:'لماذا يختار أصحاب المطاعم صحنك؟',
  why_sub:'كل تحديث تحتاجه لقائمتك — سعر جديد، صنف موسمي، إخفاء طبق نفد — يستغرق ثوانٍ، لا أيامًا ولا تكلفة طباعة.',
  feat1t:'⚡ سرعة التحديث', feat1s:'غيّر السعر أو أخفِ صنفًا في ثوانٍ من لوحة الإدارة، دون انتظار مطبعة أو تصميم جديد.',
  feat2t:'🔗 رابط ورمز QR خاص بك', feat2s:'رابط عام باسم مطعمك مع رمز QR جاهز للطباعة ووضعه على الطاولات أو عند الصندوق.',
  feat3t:'📱 تجربة أنيقة على الهاتف', feat3s:'صفحة منيو نظيفة ومتجاوبة تفتح مباشرة من متصفح الزبون، بلا تحميل أي تطبيق.',
  steps_title:'تبدأ في 3 خطوات فقط', steps_sub:'من التسجيل إلى منيو منشور جاهز للمسح، بدون أي تعقيد تقني.',
  step1t:'أنشئ حسابك', step1s:'بريدك الإلكتروني وكلمة مرور — تسجيل يستغرق أقل من دقيقة.',
  step2t:'ابنِ منيو مطعمك', step2s:'أضف أقسامك وأصنافك وأسعارك.',
  step3t:'انشر وشارك الرابط', step3s:'احصل على رابط ورمز QR فوريين، اطبعهما، وابدأ استقبال الزبائن رقميًا.',
  cta_title:'قائمتك الورقية تنتظر التحديث منذ متى؟',
  cta_sub:'انضم الآن، وحوّل مطعمك إلى تجربة رقمية عصرية يحبها زبائنك — ولا يتطلب أي خبرة تقنية.',
  cta_btn:'أنشئ منيو مطعمك الآن',
  footer:'صحنك — منيو رقمية للمطاعم والمقاهي حول العالم',

  auth_title:'الدخول إلى صحنك', auth_sub:'يجب إنشاء حساب قبل الوصول إلى لوحة الإدارة',
  tab_signup:'إنشاء حساب', tab_login:'تسجيل الدخول',
  m_email:'بريد إلكتروني', m_phone:'رقم الهاتف',
  lbl_email:'البريد الإلكتروني', lbl_phone:'رقم الهاتف',
  lbl_pass:'كلمة المرور', ph_pass:'8 أحرف على الأقل',
  lbl_pass2:'تأكيد كلمة المرور', ph_pass2:'أعد كتابة كلمة المرور',
  btn_send_code:'إرسال رمز التحقق',
  sent_to:'أرسلنا رمزًا مكوّنًا من 6 أرقام إلى',
  lbl_code:'أدخل رمز التحقق',
  btn_confirm:'تأكيد وإنشاء الحساب', btn_back:'رجوع', btn_login:'تسجيل الدخول',
  legal_terms:'الشروط والأحكام', legal_privacy:'سياسة الخصوصية', legal_agree:'بإنشاء حساب فإنك توافق على ', legal_and:' و', legal_home:'العودة للرئيسية',
  forgot_link:'نسيت كلمة المرور؟',
  forgot_title:'استعادة كلمة المرور', forgot_sub:'أدخل البريد الإلكتروني الذي سجّلت به وسنرسل إليه رابط تعيين كلمة مرور جديدة.',
  forgot_id_label:'البريد الإلكتروني',
  recovery_note:'هذا الحساب مسجّل برقم هاتف. أدخل بريدك الإلكتروني لإرسال رابط الاستعادة إليه (سيُحفظ لاستخدامه في المرات القادمة).',
  recovery_email_label:'بريدك الإلكتروني',
  btn_send_reset:'إرسال رابط الاستعادة',
  reset_sent_prefix:'تم إرسال رابط الاستعادة إلى',
  dev_note_smtp:'لا يوجد إعداد SMTP حقيقي بعد — افتح سجلات الخادم (Logs) لترى الرابط.',
  btn_back_login:'رجوع لتسجيل الدخول',

  logged_as:'مسجّل الدخول بحساب:', btn_logout:'تسجيل الخروج', sub_badge:'مشترك ✅',
  restaurant_info:'بيانات المطعم (حسابك الخاص)', lbl_rname:'اسم المطعم', ph_rname:'مقهى الدار',
  lbl_rslug:'الرابط المختصر', lbl_rdesc:'وصف مختصر (اختياري)', ph_rdesc:'مقهى ومطعم يقدم المشروبات والفطور والحلويات',
  sections_title:'أقسام المنيو والأصناف', btn_add_section:'+ إضافة قسم',
  status_label:'الحالة:', status_pub:'منشور', status_draft:'مسودة',
  btn_publish:'نشر المنيو', btn_unpublish:'إلغاء النشر',
  public_link:'الرابط العام', btn_preview:'فتح معاينة المنيو', preview_any_menu:'معاينة أي منيو منشور',
  new_section:'قسم جديد', btn_add_item:'➕ صنف', ph_item_desc:'وصف الصنف',
  pill_avail:'متاح', pill_hidden:'مخفي',
  empty_sections:'لا توجد أقسام بعد.', empty_items:'لا توجد أصناف.',
  alert_need_slug:'أدخل الرابط المختصر أولًا.', save_ok:'تم الحفظ ✓',

  billing_title:'اشترك للوصول إلى لوحة الإدارة', billing_sub:'تحويل يدوي بسيط، يُفعَّل حسابك خلال وقت قصير بعد المراجعة',
  pending_msg:'تم استلام طلبك وهو قيد المراجعة الآن. سيُفعَّل حسابك تلقائيًا فور تأكيد استلام التحويل.',
  monthly_sub:'اشتراك شهري',
  pay_steps_title:'خطوات الدفع:',
  pay_step1:'حوّل المبلغ أعلاه عبر', pay_step2:'اضغط "لقد قمت بالتحويل" في أسفل الصفحة.',
  pay_step3:'سيراجع صاحب الموقع التحويل ويُفعّل حسابك يدويًا خلال وقت قصير.',
  phone_label:'رقم الدفع / الحساب', rib_label:'أو الحساب البنكي (IBAN / RIB)',
  note_label:'ملاحظة (اختياري — مثلاً اسمك في التحويل)', note_ph:'حوّلت من حساب باسم...',
  btn_claim:'لقد قمت بالتحويل', rejected_msg:'تم رفض طلب التحويل السابق، يمكنك إرسال طلب جديد بعد التأكد من التحويل.',

  menu_no_slug:'أضف ?slug=اسم-المطعم إلى الرابط.', menu_not_published:'هذا المنيو غير متاح حاليًا.',

  reset_title:'تعيين كلمة مرور جديدة', reset_pass1:'كلمة المرور الجديدة', reset_pass2:'تأكيد كلمة المرور',
  btn_reset:'تعيين كلمة المرور', reset_ok:'تم تغيير كلمة المرور بنجاح ✅', btn_login_now:'تسجيل الدخول الآن',
  reset_invalid:'هذا الرابط غير صالح أو منتهي الصلاحية.', btn_back_to_login:'العودة لتسجيل الدخول',

  admin_login_title:'دخول المشرف', admin_pw_label:'كلمة مرور المشرف', btn_admin_login:'دخول',
  admin_panel_title:'لوحة مراجعة طلبات الاشتراك', pending_requests:'الطلبات المعلّقة', all_requests:'سجل الطلبات (الكل)',
  no_pending:'لا توجد طلبات معلّقة حاليًا.', no_requests:'لا توجد طلبات بعد.',
  status_approved:'مقبول ✅', status_rejected:'مرفوض ✕', status_pending:'قيد المراجعة',
  btn_approve:'قبول', btn_reject:'رفض', note_prefix:'ملاحظة:',

  err_server:'تعذّر الاتصال بالخادم.', err_generic:'حدث خطأ',
  err_MISSING_FIELDS:'البيانات ناقصة', err_BAD_EMAIL:'أدخل بريدًا إلكترونيًا صحيحًا.', err_BAD_PHONE:'أدخل رقم هاتف صحيح.',
  err_SHORT_PASSWORD:'كلمة المرور يجب أن تكون 8 أحرف على الأقل.', err_PASSWORD_MISMATCH:'كلمتا المرور غير متطابقتين.',
  err_PHONE_SIGNUP_DISABLED:'التسجيل برقم الهاتف غير متاح حاليًا، استخدم بريدك الإلكتروني.', phone_signup_off:'التسجيل الجديد متاح حاليًا عبر البريد الإلكتروني فقط. أصحاب الحسابات المسجّلة برقم هاتف يستطيعون الدخول كالمعتاد.',
  err_ACCOUNT_EXISTS:'يوجد حساب مسجّل بهذه البيانات مسبقًا، جرّب تسجيل الدخول.', err_SEND_CODE_FAILED:'تعذّر إرسال رمز التحقق الآن.',
  err_NO_PENDING_CODE:'لم يتم طلب رمز لهذا الحساب.', err_CODE_EXPIRED:'انتهت صلاحية الرمز، اطلب رمزًا جديدًا.',
  err_WRONG_CODE:'الرمز غير صحيح، حاول مجددًا.', err_INVALID_LOGIN:'بيانات الدخول غير صحيحة أو الحساب غير موجود.',
  err_MISSING_IDENTIFIER:"أدخل بريدك الإلكتروني.", err_ACCOUNT_NOT_FOUND:'لا يوجد حساب مسجّل بهذه البيانات.',
  err_SEND_RESET_FAILED:'تعذّر إرسال رابط الاستعادة الآن.', err_INVALID_TOKEN:'رابط غير صالح.',
  err_TOKEN_EXPIRED:'انتهت صلاحية الرابط، اطلب رابطًا جديدًا.', err_USER_NOT_FOUND:'المستخدم غير موجود.',
  err_SLUG_TAKEN:'الرابط المختصر مستخدم من مطعم آخر، اختر رابطًا مختلفًا.', err_RESTAURANT_NOT_FOUND:'لم يتم العثور على المطعم.',
  err_SUBSCRIPTION_REQUIRED:'يجب الاشتراك أولًا.', err_AUTH_REQUIRED:'يجب تسجيل الدخول.', err_INVALID_SESSION:'جلسة غير صالحة، سجّل الدخول من جديد.',
  err_ADMIN_WRONG_PASSWORD:'كلمة مرور المشرف غير صحيحة.', err_ADMIN_NOT_CONFIGURED:'لم يتم إعداد كلمة مرور المشرف بعد.',
  err_CLAIM_NOT_FOUND:'الطلب غير موجود.', err_MENU_NOT_AVAILABLE:'هذا المنيو غير متاح.',
  err_BAD_COLOR:'لون غير صالح.', err_IMAGE_TOO_LARGE:'حجم الصورة كبير جدًا، اختر صورة أصغر.',

  lbl_currency:'عملة الأسعار', currency_hint:'ستُعرض أسعار منيو بهذه العملة.', currency_select:'— اختر العملة —', currency_other:'أخرى…', currency_other_ph:'مثال: USD',
  err_BAD_CURRENCY:'رمز العملة غير صالح (3 أحرف مثل USD).', err_CURRENCY_REQUIRED:'اختر عملة الأسعار قبل نشر المنيو.',

  branding_title:'تخصيص مظهر المنيو', brand_color_label:'لون الهوية (يُستخدم في رمز QR وألوان الصفحة)',
  cover_image_label:'صورة غلاف المنيو (اختياري)', btn_upload_cover:'رفع صورة', btn_remove_cover:'إزالة الصورة',
  cover_hint:'ستظهر هذه الصورة كخلفية أعلى صفحة المنيو العامة.',
  scan_caption:'امسح لرؤية القائمة',
  btn_download_sticker:'تنزيل ملصق QR للطباعة', sticker_hint:'ملصق جاهز للطباعة ولصقه على طاولات مطعمك.'
},
en: { dir:'ltr', logo:'Sahnak',
  nav_login:'Sign in / Create account',
  home_title:'Turn your restaurant menu into a digital menu, easily',
  home_sub:'Create your own account, build your menu, and share a link and QR code your customers open right from their phone. No reprinting, ever.',
  home_cta:'Get started now',
  stat1:'0', stat1_l:'Reprints needed',
  stat2:'Minutes', stat2_l:'To build a full menu',
  stat3:'24/7', stat3_l:'Menu always available',
  why_title:'Why restaurant owners choose Sahnak',
  why_sub:'Every update your menu needs — a new price, a seasonal item, hiding a sold-out dish — takes seconds, not days or printing costs.',
  feat1t:'⚡ Fast updates', feat1s:'Change a price or hide an item in seconds from the admin panel, no printer or new design needed.',
  feat2t:'🔗 Your own link & QR code', feat2s:'A public link with your restaurant name and a printable QR code for tables or the counter.',
  feat3t:"📱 A clean mobile experience", feat3s:"A clean, responsive menu page that opens straight from the customer's browser, no app required.",
  steps_title:'Get started in 3 steps', steps_sub:'From signup to a published menu ready to scan, with no technical hassle.',
  step1t:'Create your account', step1s:'Your email and a password — signup takes under a minute.',
  step2t:'Build your menu', step2s:'Add your sections, items and prices.',
  step3t:'Publish and share your link', step3s:'Get an instant link and QR code, print them, and start serving customers digitally.',
  cta_title:'How long has your paper menu needed updating?',
  cta_sub:'Join now and turn your restaurant into a modern digital experience your customers will love — no technical skill required.',
  cta_btn:'Build your menu now',
  footer:'Sahnak — digital menus for restaurants and cafes worldwide',

  auth_title:'Sign in to Sahnak', auth_sub:'You must create an account before accessing the admin panel',
  tab_signup:'Create account', tab_login:'Sign in',
  m_email:'Email', m_phone:'Phone number',
  lbl_email:'Email address', lbl_phone:'Phone number',
  lbl_pass:'Password', ph_pass:'At least 8 characters',
  lbl_pass2:'Confirm password', ph_pass2:'Re-enter your password',
  btn_send_code:'Send verification code',
  sent_to:'We sent a 6-digit code to',
  lbl_code:'Enter verification code',
  btn_confirm:'Confirm & create account', btn_back:'Back', btn_login:'Sign in',
  legal_terms:'Terms of Service', legal_privacy:'Privacy Policy', legal_agree:'By creating an account you agree to the ', legal_and:' and ', legal_home:'Back to home',
  forgot_link:'Forgot your password?',
  forgot_title:'Reset your password', forgot_sub:'Enter the email you signed up with and we will send you a link to set a new password.',
  forgot_id_label:'Email address',
  recovery_note:'This account is registered by phone. Enter your email to receive the reset link (it will be saved for next time).',
  recovery_email_label:'Your email',
  btn_send_reset:'Send reset link',
  reset_sent_prefix:'Reset link sent to',
  dev_note_smtp:'No real SMTP configured yet — check the server Logs to see the link.',
  btn_back_login:'Back to sign in',

  logged_as:'Signed in as:', btn_logout:'Log out', sub_badge:'Subscribed ✅',
  restaurant_info:'Restaurant details (your account)', lbl_rname:'Restaurant name', ph_rname:'Dar Cafe',
  lbl_rslug:'Short link', lbl_rdesc:'Short description (optional)', ph_rdesc:'A cafe serving drinks, breakfast and desserts',
  sections_title:'Menu sections & items', btn_add_section:'+ Add section',
  status_label:'Status:', status_pub:'Published', status_draft:'Draft',
  btn_publish:'Publish menu', btn_unpublish:'Unpublish',
  public_link:'Public link', btn_preview:'Open menu preview', preview_any_menu:'Preview any published menu',
  new_section:'New section', btn_add_item:'➕ Item', ph_item_desc:'Item description',
  pill_avail:'Available', pill_hidden:'Hidden',
  empty_sections:'No sections yet.', empty_items:'No items yet.',
  alert_need_slug:'Enter the short link first.', save_ok:'Saved ✓',

  billing_title:'Subscribe to access the admin panel', billing_sub:'A simple manual transfer, your account is activated shortly after review',
  pending_msg:'Your request has been received and is under review. Your account will be activated automatically once the transfer is confirmed.',
  monthly_sub:'Monthly subscription',
  pay_steps_title:'Payment steps:',
  pay_step1:'Transfer the amount above via', pay_step2:'Click "I\'ve made the transfer" at the bottom of the page.',
  pay_step3:'The site owner will review the transfer and activate your account shortly.',
  phone_label:'Payment number / account', rib_label:'Or bank account (IBAN / RIB)',
  note_label:'Note (optional — e.g. your name on the transfer)', note_ph:'Transferred from an account under...',
  btn_claim:"I've made the transfer", rejected_msg:'Your previous transfer request was rejected, you can send a new one after confirming the transfer.',

  menu_no_slug:'Add ?slug=restaurant-name to the link.', menu_not_published:'This menu is not available right now.',

  reset_title:'Set a new password', reset_pass1:'New password', reset_pass2:'Confirm password',
  btn_reset:'Set password', reset_ok:'Password changed successfully ✅', btn_login_now:'Sign in now',
  reset_invalid:'This link is invalid or has expired.', btn_back_to_login:'Back to sign in',

  admin_login_title:'Admin login', admin_pw_label:'Admin password', btn_admin_login:'Sign in',
  admin_panel_title:'Subscription requests panel', pending_requests:'Pending requests', all_requests:'All requests (history)',
  no_pending:'No pending requests right now.', no_requests:'No requests yet.',
  status_approved:'Approved ✅', status_rejected:'Rejected ✕', status_pending:'Under review',
  btn_approve:'Approve', btn_reject:'Reject', note_prefix:'Note:',

  err_server:'Could not connect to the server.', err_generic:'An error occurred',
  err_MISSING_FIELDS:'Missing information', err_BAD_EMAIL:'Enter a valid email address.', err_BAD_PHONE:'Enter a valid phone number.',
  err_SHORT_PASSWORD:'Password must be at least 8 characters.', err_PASSWORD_MISMATCH:'Passwords do not match.',
  err_PHONE_SIGNUP_DISABLED:'Phone signup is not available right now, please use your email.', phone_signup_off:'New signups are currently available by email only. Existing phone accounts can still sign in as usual.',
  err_ACCOUNT_EXISTS:'An account already exists with this info, try signing in.', err_SEND_CODE_FAILED:'Could not send the verification code right now.',
  err_NO_PENDING_CODE:'No code was requested for this account.', err_CODE_EXPIRED:'The code has expired, request a new one.',
  err_WRONG_CODE:'Incorrect code, try again.', err_INVALID_LOGIN:'Invalid credentials or account not found.',
  err_MISSING_IDENTIFIER:"Enter your email address.", err_ACCOUNT_NOT_FOUND:'No account found with this info.',
  err_SEND_RESET_FAILED:'Could not send the reset link right now.', err_INVALID_TOKEN:'Invalid link.',
  err_TOKEN_EXPIRED:'The link has expired, request a new one.', err_USER_NOT_FOUND:'User not found.',
  err_SLUG_TAKEN:'This short link is already used by another restaurant, choose a different one.', err_RESTAURANT_NOT_FOUND:'Restaurant not found.',
  err_SUBSCRIPTION_REQUIRED:'You must subscribe first.', err_AUTH_REQUIRED:'You must sign in.', err_INVALID_SESSION:'Invalid session, please sign in again.',
  err_ADMIN_WRONG_PASSWORD:'Incorrect admin password.', err_ADMIN_NOT_CONFIGURED:'Admin password not configured yet.',
  err_CLAIM_NOT_FOUND:'Request not found.', err_MENU_NOT_AVAILABLE:'This menu is not available.',
  err_BAD_COLOR:'Invalid color.', err_IMAGE_TOO_LARGE:'Image is too large, pick a smaller one.',

  lbl_currency:'Price currency', currency_hint:'Prices on your menu will be shown in this currency.', currency_select:'— Select currency —', currency_other:'Other…', currency_other_ph:'e.g. USD',
  err_BAD_CURRENCY:'Invalid currency code (3 letters, e.g. USD).', err_CURRENCY_REQUIRED:'Choose your price currency before publishing the menu.',

  branding_title:'Customize menu appearance', brand_color_label:'Brand color (used in the QR code and page accents)',
  cover_image_label:'Menu cover image (optional)', btn_upload_cover:'Upload image', btn_remove_cover:'Remove image',
  cover_hint:'This image will appear as a banner at the top of your public menu page.',
  scan_caption:'Scan to view the menu',
  btn_download_sticker:'Download printable QR sticker', sticker_hint:'A print-ready sticker to stick on your restaurant tables.'
},
fr: { dir:'ltr', logo:'Sahnak',
  nav_login:'Connexion / Créer un compte',
  home_title:'Transformez votre menu papier en menu numérique, simplement',
  home_sub:"Créez votre compte, construisez le menu de votre restaurant, et partagez un lien et un code QR que vos clients ouvrent depuis leur téléphone. Plus jamais besoin de réimprimer.",
  home_cta:'Commencer maintenant',
  stat1:'0', stat1_l:'Réimpression nécessaire',
  stat2:'Minutes', stat2_l:'Pour créer un menu complet',
  stat3:'24/7', stat3_l:'Menu toujours disponible',
  why_title:'Pourquoi les restaurateurs choisissent Sahnak',
  why_sub:"Chaque mise à jour de votre menu — un nouveau prix, un plat saisonnier, masquer un plat épuisé — prend quelques secondes, sans délai ni coût d'impression.",
  feat1t:'⚡ Mises à jour rapides', feat1s:'Changez un prix ou masquez un article en quelques secondes, sans imprimeur ni nouveau design.',
  feat2t:'🔗 Votre lien et code QR', feat2s:'Un lien public au nom de votre restaurant avec un code QR imprimable pour les tables ou la caisse.',
  feat3t:'📱 Une expérience mobile soignée', feat3s:"Une page de menu claire et responsive, ouverte directement depuis le navigateur du client, sans application.",
  steps_title:'Démarrez en 3 étapes', steps_sub:"De l'inscription au menu publié prêt à scanner, sans complexité technique.",
  step1t:'Créez votre compte', step1s:"Votre e-mail et un mot de passe — l'inscription prend moins d'une minute.",
  step2t:'Construisez votre menu', step2s:'Ajoutez vos sections, articles et prix.',
  step3t:'Publiez et partagez le lien', step3s:'Obtenez un lien et un code QR instantanés, imprimez-les, et accueillez vos clients numériquement.',
  cta_title:'Depuis quand votre menu papier attend une mise à jour ?',
  cta_sub:'Rejoignez maintenant, et transformez votre restaurant en une expérience numérique moderne que vos clients adoreront — sans aucune compétence technique requise.',
  cta_btn:'Créez votre menu maintenant',
  footer:'Sahnak — menus numériques pour restaurants et cafés dans le monde entier',

  auth_title:'Connexion à Sahnak', auth_sub:"Vous devez créer un compte avant d'accéder à l'espace admin",
  tab_signup:'Créer un compte', tab_login:'Se connecter',
  m_email:'E-mail', m_phone:'Numéro de téléphone',
  lbl_email:'Adresse e-mail', lbl_phone:'Numéro de téléphone',
  lbl_pass:'Mot de passe', ph_pass:'8 caractères minimum',
  lbl_pass2:'Confirmer le mot de passe', ph_pass2:'Ressaisissez le mot de passe',
  btn_send_code:'Envoyer le code de vérification',
  sent_to:'Nous avons envoyé un code à 6 chiffres à',
  lbl_code:'Entrez le code de vérification',
  btn_confirm:'Confirmer et créer le compte', btn_back:'Retour', btn_login:'Se connecter',
  legal_terms:"Conditions d'utilisation", legal_privacy:'Politique de confidentialité', legal_agree:"En créant un compte, vous acceptez les ", legal_and:' et la ', legal_home:"Retour à l'accueil",
  forgot_link:'Mot de passe oublié ?',
  forgot_title:'Réinitialiser le mot de passe', forgot_sub:"Entrez l'e-mail utilisé à l'inscription et nous vous enverrons un lien pour définir un nouveau mot de passe.",
  forgot_id_label:'Adresse e-mail',
  recovery_note:"Ce compte est enregistré par téléphone. Entrez votre e-mail pour recevoir le lien de réinitialisation (il sera enregistré pour la prochaine fois).",
  recovery_email_label:'Votre e-mail',
  btn_send_reset:'Envoyer le lien de réinitialisation',
  reset_sent_prefix:'Lien de réinitialisation envoyé à',
  dev_note_smtp:'Aucune configuration SMTP réelle — consultez les Logs du serveur pour voir le lien.',
  btn_back_login:'Retour à la connexion',

  logged_as:'Connecté en tant que :', btn_logout:'Se déconnecter', sub_badge:'Abonné ✅',
  restaurant_info:'Informations du restaurant (votre compte)', lbl_rname:'Nom du restaurant', ph_rname:'Dar Cafe',
  lbl_rslug:'Lien court', lbl_rdesc:'Description courte (optionnel)', ph_rdesc:'Un café proposant boissons, petit-déjeuner et desserts',
  sections_title:'Sections du menu et articles', btn_add_section:'+ Ajouter une section',
  status_label:'Statut :', status_pub:'Publié', status_draft:'Brouillon',
  btn_publish:'Publier le menu', btn_unpublish:'Dépublier',
  public_link:'Lien public', btn_preview:"Ouvrir l'aperçu du menu", preview_any_menu:'Aperçu de tout menu publié',
  new_section:'Nouvelle section', btn_add_item:'➕ Article', ph_item_desc:"Description de l'article",
  pill_avail:'Disponible', pill_hidden:'Masqué',
  empty_sections:'Aucune section pour le moment.', empty_items:'Aucun article pour le moment.',
  alert_need_slug:"Entrez d'abord le lien court.", save_ok:'Enregistré ✓',

  billing_title:"Abonnez-vous pour accéder à l'espace admin", billing_sub:'Un virement manuel simple, votre compte est activé peu après vérification',
  pending_msg:'Votre demande a été reçue et est en cours de vérification. Votre compte sera activé automatiquement une fois le virement confirmé.',
  monthly_sub:'Abonnement mensuel',
  pay_steps_title:'Étapes du paiement :',
  pay_step1:'Virez le montant ci-dessus via', pay_step2:'Cliquez sur « J\'ai effectué le virement » en bas de la page.',
  pay_step3:'Le propriétaire du site vérifiera le virement et activera votre compte sous peu.',
  phone_label:'Numéro / compte de paiement', rib_label:'Ou compte bancaire (IBAN / RIB)',
  note_label:'Note (optionnel — ex. votre nom sur le virement)', note_ph:'Viré depuis un compte au nom de...',
  btn_claim:"J'ai effectué le virement", rejected_msg:"Votre précédente demande de virement a été rejetée, vous pouvez en envoyer une nouvelle après avoir confirmé le virement.",

  menu_no_slug:'Ajoutez ?slug=nom-du-restaurant au lien.', menu_not_published:"Ce menu n'est pas disponible actuellement.",

  reset_title:'Définir un nouveau mot de passe', reset_pass1:'Nouveau mot de passe', reset_pass2:'Confirmer le mot de passe',
  btn_reset:'Définir le mot de passe', reset_ok:'Mot de passe modifié avec succès ✅', btn_login_now:'Se connecter maintenant',
  reset_invalid:'Ce lien est invalide ou a expiré.', btn_back_to_login:'Retour à la connexion',

  admin_login_title:'Connexion administrateur', admin_pw_label:'Mot de passe administrateur', btn_admin_login:'Connexion',
  admin_panel_title:"Panneau de vérification des abonnements", pending_requests:'Demandes en attente', all_requests:'Historique des demandes',
  no_pending:'Aucune demande en attente actuellement.', no_requests:'Aucune demande pour le moment.',
  status_approved:'Approuvé ✅', status_rejected:'Rejeté ✕', status_pending:'En cours de vérification',
  btn_approve:'Approuver', btn_reject:'Rejeter', note_prefix:'Note :',

  err_server:'Impossible de se connecter au serveur.', err_generic:'Une erreur est survenue',
  err_MISSING_FIELDS:'Informations manquantes', err_BAD_EMAIL:'Entrez une adresse e-mail valide.', err_BAD_PHONE:'Entrez un numéro de téléphone valide.',
  err_SHORT_PASSWORD:'Le mot de passe doit contenir au moins 8 caractères.', err_PASSWORD_MISMATCH:'Les mots de passe ne correspondent pas.',
  err_PHONE_SIGNUP_DISABLED:"L'inscription par téléphone n'est pas disponible pour le moment, utilisez votre e-mail.", phone_signup_off:"Les nouvelles inscriptions se font actuellement par e-mail uniquement. Les comptes déjà créés avec un téléphone peuvent se connecter normalement.",
  err_ACCOUNT_EXISTS:'Un compte existe déjà avec ces informations, essayez de vous connecter.', err_SEND_CODE_FAILED:"Impossible d'envoyer le code pour le moment.",
  err_NO_PENDING_CODE:'Aucun code demandé pour ce compte.', err_CODE_EXPIRED:'Le code a expiré, demandez-en un nouveau.',
  err_WRONG_CODE:'Code incorrect, réessayez.', err_INVALID_LOGIN:'Identifiants invalides ou compte introuvable.',
  err_MISSING_IDENTIFIER:"Entrez votre adresse e-mail.", err_ACCOUNT_NOT_FOUND:'Aucun compte trouvé avec ces informations.',
  err_SEND_RESET_FAILED:'Impossible d\'envoyer le lien pour le moment.', err_INVALID_TOKEN:'Lien invalide.',
  err_TOKEN_EXPIRED:'Le lien a expiré, demandez-en un nouveau.', err_USER_NOT_FOUND:'Utilisateur introuvable.',
  err_SLUG_TAKEN:"Ce lien court est déjà utilisé par un autre restaurant, choisissez-en un autre.", err_RESTAURANT_NOT_FOUND:'Restaurant introuvable.',
  err_SUBSCRIPTION_REQUIRED:"Vous devez d'abord vous abonner.", err_AUTH_REQUIRED:'Vous devez vous connecter.', err_INVALID_SESSION:'Session invalide, reconnectez-vous.',
  err_ADMIN_WRONG_PASSWORD:'Mot de passe administrateur incorrect.', err_ADMIN_NOT_CONFIGURED:'Mot de passe administrateur non configuré.',
  err_CLAIM_NOT_FOUND:'Demande introuvable.', err_MENU_NOT_AVAILABLE:"Ce menu n'est pas disponible.",
  err_BAD_COLOR:'Couleur invalide.', err_IMAGE_TOO_LARGE:'Image trop volumineuse, choisissez-en une plus petite.',

  lbl_currency:'Devise des prix', currency_hint:'Les prix de votre menu seront affichés dans cette devise.', currency_select:'— Choisir la devise —', currency_other:'Autre…', currency_other_ph:'ex. USD',
  err_BAD_CURRENCY:'Code de devise invalide (3 lettres, ex. USD).', err_CURRENCY_REQUIRED:'Choisissez la devise des prix avant de publier le menu.',

  branding_title:'Personnaliser l\'apparence du menu', brand_color_label:'Couleur de marque (utilisée dans le code QR et les accents de la page)',
  cover_image_label:'Image de couverture du menu (optionnel)', btn_upload_cover:'Téléverser une image', btn_remove_cover:'Supprimer l\'image',
  cover_hint:'Cette image apparaîtra en bannière en haut de votre page de menu publique.',
  scan_caption:'Scannez pour voir le menu',
  btn_download_sticker:'Télécharger l\'autocollant QR imprimable', sticker_hint:'Un autocollant prêt à imprimer pour vos tables.'
},
tr: { dir:'ltr', logo:'Sahnak',
  nav_login:'Giriş yap / Hesap oluştur',
  home_title:'Restoran menünüzü kolayca dijital menüye dönüştürün',
  home_sub:'Kendi hesabınızı oluşturun, menünüzü hazırlayın ve müşterilerinizin telefonlarından doğrudan açtığı bir bağlantı ile QR kod paylaşın. Bir daha asla yeniden baskı yok.',
  home_cta:'Hemen başlayın',
  stat1:'0', stat1_l:'Gereken yeniden baskı',
  stat2:'Dakikalar', stat2_l:'Eksiksiz bir menü için',
  stat3:'7/24', stat3_l:'Menü her zaman erişilebilir',
  why_title:"Restoran sahipleri neden Sahnak'ı seçiyor?",
  why_sub:'Menünüzün ihtiyaç duyduğu her güncelleme — yeni bir fiyat, mevsimlik bir ürün, tükenen bir yemeği gizlemek — günler ya da baskı maliyeti değil, saniyeler sürer.',
  feat1t:'⚡ Hızlı güncellemeler', feat1s:'Yönetim panelinden bir fiyatı değiştirin ya da bir ürünü saniyeler içinde gizleyin; matbaaya veya yeni bir tasarıma gerek yok.',
  feat2t:'🔗 Size özel bağlantı ve QR kod', feat2s:'Restoran adınızı taşıyan herkese açık bir bağlantı ve masalara ya da kasaya koyabileceğiniz, yazdırılabilir bir QR kod.',
  feat3t:'📱 Temiz bir mobil deneyim', feat3s:'Müşterinin tarayıcısından doğrudan açılan, temiz ve duyarlı bir menü sayfası; uygulama gerekmez.',
  steps_title:'3 adımda başlayın', steps_sub:'Kayıttan, taranmaya hazır yayımlanmış bir menüye; teknik zorluk olmadan.',
  step1t:'Hesabınızı oluşturun', step1s:'E-postanız ve bir şifre — kayıt bir dakikadan kısa sürer.',
  step2t:'Menünüzü hazırlayın', step2s:'Bölümlerinizi, ürünlerinizi ve fiyatlarınızı ekleyin.',
  step3t:'Yayımlayın ve bağlantınızı paylaşın', step3s:'Anında bir bağlantı ve QR kod alın, yazdırın ve müşterilerinize dijital olarak hizmet vermeye başlayın.',
  cta_title:'Kâğıt menünüz ne zamandır güncelleme bekliyor?',
  cta_sub:'Hemen katılın ve restoranınızı müşterilerinizin seveceği modern bir dijital deneyime dönüştürün — teknik beceri gerekmez.',
  cta_btn:'Menünüzü şimdi oluşturun',
  footer:'Sahnak — dünya genelinde restoranlar ve kafeler için dijital menüler',

  auth_title:"Sahnak'a giriş yapın", auth_sub:'Yönetim paneline erişmeden önce bir hesap oluşturmalısınız',
  tab_signup:'Hesap oluştur', tab_login:'Giriş yap',
  m_email:'E-posta', m_phone:'Telefon numarası',
  lbl_email:'E-posta adresi', lbl_phone:'Telefon numarası',
  lbl_pass:'Şifre', ph_pass:'En az 8 karakter',
  lbl_pass2:'Şifreyi onaylayın', ph_pass2:'Şifrenizi tekrar girin',
  btn_send_code:'Doğrulama kodu gönder',
  sent_to:'6 haneli bir kod gönderdik:',
  lbl_code:'Doğrulama kodunu girin',
  btn_confirm:'Onayla ve hesabı oluştur', btn_back:'Geri', btn_login:'Giriş yap',
  legal_terms:'Kullanım Koşulları', legal_privacy:'Gizlilik Politikası', legal_agree:'Hesap oluşturarak şunları kabul edersiniz: ', legal_and:' ve ', legal_home:'Ana sayfaya dön',
  forgot_link:'Şifrenizi mi unuttunuz?',
  forgot_title:'Şifrenizi sıfırlayın', forgot_sub:'Kaydolurken kullandığınız e-postayı girin; yeni bir şifre belirlemeniz için size bir bağlantı gönderelim.',
  forgot_id_label:'E-posta adresi',
  recovery_note:'Bu hesap telefonla kayıtlı. Sıfırlama bağlantısını almak için e-postanızı girin (bir sonraki sefer için kaydedilecektir).',
  recovery_email_label:'E-postanız',
  btn_send_reset:'Sıfırlama bağlantısı gönder',
  reset_sent_prefix:'Sıfırlama bağlantısı gönderildi:',
  dev_note_smtp:'Henüz gerçek bir SMTP yapılandırılmadı — bağlantıyı görmek için sunucu günlüklerine (Logs) bakın.',
  btn_back_login:'Girişe dön',

  logged_as:'Giriş yapan hesap:', btn_logout:'Çıkış yap', sub_badge:'Abone ✅',
  restaurant_info:'Restoran bilgileri (hesabınız)', lbl_rname:'Restoran adı', ph_rname:'Lezzet Cafe',
  lbl_rslug:'Kısa bağlantı', lbl_rdesc:'Kısa açıklama (isteğe bağlı)', ph_rdesc:'İçecek, kahvaltı ve tatlı servisi yapan bir kafe',
  sections_title:'Menü bölümleri ve ürünler', btn_add_section:'+ Bölüm ekle',
  status_label:'Durum:', status_pub:'Yayında', status_draft:'Taslak',
  btn_publish:'Menüyü yayımla', btn_unpublish:'Yayından kaldır',
  public_link:'Herkese açık bağlantı', btn_preview:'Menü önizlemesini aç', preview_any_menu:'Yayımlanmış herhangi bir menüyü önizle',
  new_section:'Yeni bölüm', btn_add_item:'➕ Ürün', ph_item_desc:'Ürün açıklaması',
  pill_avail:'Mevcut', pill_hidden:'Gizli',
  empty_sections:'Henüz bölüm yok.', empty_items:'Henüz ürün yok.',
  alert_need_slug:'Önce kısa bağlantıyı girin.', save_ok:'Kaydedildi ✓',

  billing_title:'Yönetim paneline erişmek için abone olun', billing_sub:'Basit bir manuel havale; hesabınız incelemeden kısa süre sonra etkinleştirilir',
  pending_msg:'Talebiniz alındı ve inceleniyor. Havale onaylandığında hesabınız otomatik olarak etkinleştirilecek.',
  monthly_sub:'Aylık abonelik',
  pay_steps_title:'Ödeme adımları:',
  pay_step1:'Yukarıdaki tutarı şu yolla gönderin:', pay_step2:'Sayfanın altındaki «Havaleyi yaptım» düğmesine tıklayın.',
  pay_step3:'Site sahibi havaleyi inceleyip hesabınızı kısa süre içinde etkinleştirecek.',
  phone_label:'Ödeme numarası / hesabı', rib_label:'Veya banka hesabı (IBAN / RIB)',
  note_label:'Not (isteğe bağlı — örn. havaledeki adınız)', note_ph:'Şu adla bir hesaptan gönderildi...',
  btn_claim:'Havaleyi yaptım', rejected_msg:'Önceki havale talebiniz reddedildi; havaleyi doğruladıktan sonra yeni bir talep gönderebilirsiniz.',

  menu_no_slug:'Bağlantıya ?slug=restoran-adi ekleyin.', menu_not_published:'Bu menü şu anda kullanılamıyor.',

  reset_title:'Yeni şifre belirleyin', reset_pass1:'Yeni şifre', reset_pass2:'Şifreyi onaylayın',
  btn_reset:'Şifreyi belirle', reset_ok:'Şifre başarıyla değiştirildi ✅', btn_login_now:'Şimdi giriş yap',
  reset_invalid:'Bu bağlantı geçersiz veya süresi dolmuş.', btn_back_to_login:'Girişe dön',

  admin_login_title:'Yönetici girişi', admin_pw_label:'Yönetici şifresi', btn_admin_login:'Giriş yap',
  admin_panel_title:'Abonelik talepleri paneli', pending_requests:'Bekleyen talepler', all_requests:'Tüm talepler (geçmiş)',
  no_pending:'Şu anda bekleyen talep yok.', no_requests:'Henüz talep yok.',
  status_approved:'Onaylandı ✅', status_rejected:'Reddedildi ✕', status_pending:'İnceleniyor',
  btn_approve:'Onayla', btn_reject:'Reddet', note_prefix:'Not:',

  err_server:'Sunucuya bağlanılamadı.', err_generic:'Bir hata oluştu',
  err_MISSING_FIELDS:'Eksik bilgi', err_BAD_EMAIL:'Geçerli bir e-posta adresi girin.', err_BAD_PHONE:'Geçerli bir telefon numarası girin.',
  err_SHORT_PASSWORD:'Şifre en az 8 karakter olmalıdır.', err_PASSWORD_MISMATCH:'Şifreler eşleşmiyor.',
  err_PHONE_SIGNUP_DISABLED:'Telefonla kayıt şu anda kullanılamıyor, lütfen e-postanızı kullanın.', phone_signup_off:'Yeni kayıtlar şu anda yalnızca e-posta ile yapılabilir. Telefonla açılmış mevcut hesaplar her zamanki gibi giriş yapabilir.',
  err_ACCOUNT_EXISTS:'Bu bilgilerle zaten bir hesap var, giriş yapmayı deneyin.', err_SEND_CODE_FAILED:'Doğrulama kodu şu anda gönderilemedi.',
  err_NO_PENDING_CODE:'Bu hesap için kod istenmedi.', err_CODE_EXPIRED:'Kodun süresi doldu, yenisini isteyin.',
  err_WRONG_CODE:'Hatalı kod, tekrar deneyin.', err_INVALID_LOGIN:'Geçersiz bilgiler veya hesap bulunamadı.',
  err_MISSING_IDENTIFIER:'E-posta adresinizi girin.', err_ACCOUNT_NOT_FOUND:'Bu bilgilerle hesap bulunamadı.',
  err_SEND_RESET_FAILED:'Sıfırlama bağlantısı şu anda gönderilemedi.', err_INVALID_TOKEN:'Geçersiz bağlantı.',
  err_TOKEN_EXPIRED:'Bağlantının süresi doldu, yenisini isteyin.', err_USER_NOT_FOUND:'Kullanıcı bulunamadı.',
  err_SLUG_TAKEN:'Bu kısa bağlantı başka bir restoran tarafından kullanılıyor, farklı bir tane seçin.', err_RESTAURANT_NOT_FOUND:'Restoran bulunamadı.',
  err_SUBSCRIPTION_REQUIRED:'Önce abone olmalısınız.', err_AUTH_REQUIRED:'Giriş yapmalısınız.', err_INVALID_SESSION:'Geçersiz oturum, lütfen tekrar giriş yapın.',
  err_ADMIN_WRONG_PASSWORD:'Yönetici şifresi hatalı.', err_ADMIN_NOT_CONFIGURED:'Yönetici şifresi henüz ayarlanmadı.',
  err_CLAIM_NOT_FOUND:'Talep bulunamadı.', err_MENU_NOT_AVAILABLE:'Bu menü kullanılamıyor.',
  err_BAD_COLOR:'Geçersiz renk.', err_IMAGE_TOO_LARGE:'Görsel çok büyük, daha küçük bir tane seçin.',

  lbl_currency:'Fiyat para birimi', currency_hint:'Menünüzdeki fiyatlar bu para biriminde gösterilir.', currency_select:'— Para birimi seçin —', currency_other:'Diğer…', currency_other_ph:'örn. USD',
  err_BAD_CURRENCY:'Geçersiz para birimi kodu (3 harf, örn. USD).', err_CURRENCY_REQUIRED:'Menüyü yayımlamadan önce fiyat para birimini seçin.',

  branding_title:'Menü görünümünü özelleştirin', brand_color_label:'Marka rengi (QR kodda ve sayfa vurgularında kullanılır)',
  cover_image_label:'Menü kapak görseli (isteğe bağlı)', btn_upload_cover:'Görsel yükle', btn_remove_cover:'Görseli kaldır',
  cover_hint:'Bu görsel, herkese açık menü sayfanızın en üstünde bir başlık görseli olarak görünür.',
  scan_caption:'Menüyü görmek için tarayın',
  btn_download_sticker:'Yazdırılabilir QR etiketini indir', sticker_hint:'Restoran masalarınıza yapıştırabileceğiniz, baskıya hazır bir etiket.'
}
};

var LANG_ORDER = ['ar','en','fr','tr'];
function detectLang(){
  var list = (navigator.languages && navigator.languages.length) ? navigator.languages : [navigator.language || 'en'];
  for (var i = 0; i < list.length; i++){
    var code = String(list[i]).toLowerCase().split('-')[0];
    if (DICT[code]) return code;
  }
  return 'en';
}
let lang = (function(){
  var saved = null;
  try{ saved = localStorage.getItem('sahnak_lang'); }catch(e){}
  return (saved && DICT[saved]) ? saved : detectLang();
})();

// أزرار اللغات تُبنى من القاموس، فإضافة لغة جديدة لا تتطلب تعديل أي صفحة
function buildLangBars(){
  document.querySelectorAll('.langbar').forEach(function(bar){
    bar.innerHTML = '';
    LANG_ORDER.forEach(function(code){
      var b = document.createElement('button');
      b.className = 'langbtn'; b.type = 'button'; b.dataset.lang = code;
      b.textContent = code.toUpperCase();
      b.addEventListener('click', function(){ setLang(code); });
      bar.appendChild(b);
    });
  });
}

// العملات: قائمة شائعة، والأسماء والرموز تُترجم تلقائيًا حسب لغة الواجهة
var CURRENCIES = ['USD','EUR','GBP','TRY','TND','SAR','AED','QAR','KWD','BHD','OMR','JOD','EGP','MAD','DZD','LYD','LBP','IQD','CAD','AUD','NZD','CHF','JPY','CNY','HKD','SGD','INR','PKR','BDT','IDR','MYR','THB','PHP','KRW','VND','RUB','UAH','PLN','CZK','HUF','RON','BGN','SEK','NOK','DKK','ILS','ZAR','NGN','KES','GHS','BRL','MXN','ARS','CLP','COP','PEN'];
function currencySymbol(code){
  if(!code) return '';
  try{
    var parts = new Intl.NumberFormat(lang, { style:'currency', currency: code, currencyDisplay:'symbol' }).formatToParts(0);
    for (var i = 0; i < parts.length; i++){ if (parts[i].type === 'currency') return parts[i].value; }
  }catch(e){}
  return code;
}
function currencyName(code){
  try{ return new Intl.DisplayNames([lang], { type:'currency' }).of(code) + ' (' + code + ')'; }catch(e){ return code; }
}

function t(key){
  return (DICT[lang] && DICT[lang][key]) || DICT.ar[key] || key;
}
function applyStatic(){
  document.documentElement.lang = lang;
  document.documentElement.dir = DICT[lang].dir;
  document.querySelectorAll('[data-i18n]').forEach(function(el){
    el.textContent = t(el.getAttribute('data-i18n'));
  });
  document.querySelectorAll('[data-i18n-ph]').forEach(function(el){
    el.setAttribute('placeholder', t(el.getAttribute('data-i18n-ph')));
  });
  document.querySelectorAll('.langbtn').forEach(function(b){
    b.classList.toggle('active', b.dataset.lang === lang);
  });
}
function setLang(l){
  lang = l;
  try{ localStorage.setItem('sahnak_lang', l); }catch(e){}
  applyStatic();
  document.dispatchEvent(new CustomEvent('sahnak:lang-changed'));
}
function err(data){
  if(data && data.code) return t('err_' + data.code);
  return (data && data.error) || t('err_generic');
}

window.Sahnak = { setLang: setLang, t: t, getLang: function(){ return lang; }, err: err,
  currencies: CURRENCIES, currencySymbol: currencySymbol, currencyName: currencyName };

buildLangBars();
applyStatic();
})();
