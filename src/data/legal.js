// Textes juridiques : Conditions d'utilisation et Politique de confidentialité.
// Rédigés tels quels dans chaque langue (pas de clé de traduction : ce sont de longs textes).
// Ils décrivent uniquement ce que fait réellement l'appli. Ce n'est pas un avis juridique.
export const CONTACT_EMAIL = 'gerardnoudo@gmail.com';
export const LEGAL_UPDATED = { fr: '27 novembre 2026', en: 'November 27, 2026', es: '27 de noviembre de 2026', ar: '27 نوفمبر 2026' };

const E = CONTACT_EMAIL;

export const LEGAL = {
  privacy: {
    fr: {
      title: 'Politique de confidentialité',
      updated: 'Dernière mise à jour',
      sections: [
        ['Qui est responsable ?', [`« Gestion des finances » est éditée par Gérard Lawson-Noudo (Maroc). Pour toute question sur vos données : ${E}.`]],
        ['Les données que nous traitons', [
          '• Votre adresse e-mail et votre mot de passe, pour créer et protéger votre compte. Le mot de passe n’est jamais stocké en clair : le service d’authentification n’en garde qu’une version protégée.',
          '• Les informations que vous saisissez : dépenses, revenus, comptes, budgets, objectifs d’épargne, dettes, catégories et espaces.',
          '• Des préférences enregistrées sur votre appareil : langue, devise, visite guidée et session de connexion.']],
        ['À quoi elles servent', ['Uniquement à faire fonctionner l’appli : vous connecter, afficher et calculer vos chiffres, et vous envoyer les e-mails de confirmation ou de réinitialisation du mot de passe. Pas de publicité, pas de revente de vos données, pas d’outil de suivi publicitaire.']],
        ['Où elles sont stockées', [
          'Vos données sont hébergées chez Supabase (base de données et connexion) et l’appli est diffusée par Vercel. Ces prestataires peuvent héberger les données hors du Maroc.',
          'Chaque utilisateur ne peut voir que ses propres données, et chaque espace (par exemple Perso ou CESAM) reste séparé des autres. L’éditeur n’accède aux données que pour la maintenance technique ou à votre demande.']],
        ['Partage', ['Nous ne vendons ni ne louons vos données. Elles ne sont communiquées qu’aux prestataires techniques cités plus haut, ou si la loi l’exige.']],
        ['Durée de conservation', ['Vos données sont conservées tant que votre compte existe. Sur demande, nous supprimons votre compte et les données associées.']],
        ['Vos droits', [`Vous pouvez demander l’accès à vos données, leur correction ou leur suppression en écrivant à ${E}. Nous nous efforçons de respecter la loi marocaine n° 09-08 sur la protection des données personnelles.`]],
        ['Sécurité', ['La connexion à l’appli est chiffrée (HTTPS) et l’accès aux données est restreint. Aucun système n’est sûr à 100 % : choisissez un mot de passe unique et ne le partagez pas.']],
        ['Changements', ['Cette politique peut évoluer. La date de dernière mise à jour figure en haut de la page.']],
      ],
    },
    en: {
      title: 'Privacy Policy',
      updated: 'Last updated',
      sections: [
        ['Who is responsible?', [`“Gestion des finances” is published by Gérard Lawson-Noudo (Morocco). For any question about your data: ${E}.`]],
        ['The data we process', [
          '• Your email address and password, to create and protect your account. Your password is never stored in clear text: the authentication service only keeps a protected version of it.',
          '• The information you enter: expenses, income, accounts, budgets, savings goals, debts, categories and spaces.',
          '• Preferences saved on your device: language, currency, guided tour and login session.']],
        ['What we use it for', ['Only to make the app work: sign you in, display and calculate your figures, and send you confirmation or password-reset emails. No advertising, no selling of your data, no advertising trackers.']],
        ['Where it is stored', [
          'Your data is hosted by Supabase (database and sign-in) and the app is delivered by Vercel. These providers may host data outside Morocco.',
          'Each user can only see their own data, and each space (for example Personal or CESAM) stays separate from the others. The publisher only accesses data for technical maintenance or at your request.']],
        ['Sharing', ['We do not sell or rent your data. It is only shared with the technical providers named above, or when required by law.']],
        ['How long we keep it', ['Your data is kept as long as your account exists. On request, we delete your account and the related data.']],
        ['Your rights', [`You can ask to access, correct or delete your data by writing to ${E}. We strive to comply with Moroccan law no. 09-08 on personal data protection.`]],
        ['Security', ['The connection to the app is encrypted (HTTPS) and access to data is restricted. No system is 100% secure: choose a unique password and do not share it.']],
        ['Changes', ['This policy may change. The date of the last update is shown at the top of the page.']],
      ],
    },
    es: {
      title: 'Política de privacidad',
      updated: 'Última actualización',
      sections: [
        ['¿Quién es el responsable?', [`«Gestion des finances» está publicada por Gérard Lawson-Noudo (Marruecos). Para cualquier duda sobre tus datos: ${E}.`]],
        ['Los datos que tratamos', [
          '• Tu correo electrónico y tu contraseña, para crear y proteger tu cuenta. La contraseña nunca se guarda en claro: el servicio de autenticación solo conserva una versión protegida.',
          '• La información que introduces: gastos, ingresos, cuentas, presupuestos, metas de ahorro, deudas, categorías y espacios.',
          '• Preferencias guardadas en tu dispositivo: idioma, moneda, visita guiada y sesión de inicio.']],
        ['Para qué se usan', ['Solo para que la app funcione: iniciar sesión, mostrar y calcular tus cifras y enviarte los correos de confirmación o de restablecimiento de contraseña. Sin publicidad, sin venta de tus datos y sin rastreadores publicitarios.']],
        ['Dónde se almacenan', [
          'Tus datos están alojados en Supabase (base de datos e inicio de sesión) y la app se sirve desde Vercel. Estos proveedores pueden alojar los datos fuera de Marruecos.',
          'Cada usuario solo puede ver sus propios datos, y cada espacio (por ejemplo Personal o CESAM) permanece separado de los demás. El editor solo accede a los datos para el mantenimiento técnico o a petición tuya.']],
        ['Compartir', ['No vendemos ni alquilamos tus datos. Solo se comparten con los proveedores técnicos mencionados o cuando la ley lo exige.']],
        ['Cuánto tiempo se conservan', ['Tus datos se conservan mientras exista tu cuenta. Si lo pides, eliminamos tu cuenta y los datos asociados.']],
        ['Tus derechos', [`Puedes pedir acceso, corrección o eliminación de tus datos escribiendo a ${E}. Nos esforzamos por respetar la ley marroquí n.º 09-08 sobre protección de datos personales.`]],
        ['Seguridad', ['La conexión con la app está cifrada (HTTPS) y el acceso a los datos es restringido. Ningún sistema es 100 % seguro: elige una contraseña única y no la compartas.']],
        ['Cambios', ['Esta política puede cambiar. La fecha de la última actualización aparece al principio de la página.']],
      ],
    },
    ar: {
      title: 'سياسة الخصوصية',
      updated: 'آخر تحديث',
      sections: [
        ['من المسؤول؟', [`تطبيق «Gestion des finances» من نشر جيرار لاوسون-نودو (المغرب). لأي سؤال حول بياناتك: ${E}.`]],
        ['البيانات التي نعالجها', [
          '• بريدك الإلكتروني وكلمة مرورك، لإنشاء حسابك وحمايته. لا تُخزَّن كلمة المرور أبداً بشكل مقروء: خدمة المصادقة تحتفظ بنسخة محمية منها فقط.',
          '• المعلومات التي تُدخلها: المصروفات والإيرادات والحسابات والميزانيات وأهداف الادخار والديون والفئات والمساحات.',
          '• تفضيلات محفوظة على جهازك: اللغة والعملة والجولة التعريفية وجلسة تسجيل الدخول.']],
        ['فيمَ نستخدمها', ['فقط لتشغيل التطبيق: تسجيل دخولك، وعرض أرقامك وحسابها، وإرسال رسائل التأكيد أو إعادة تعيين كلمة المرور. لا إعلانات، ولا بيع لبياناتك، ولا أدوات تتبّع إعلاني.']],
        ['أين تُخزَّن', [
          'تُستضاف بياناتك لدى Supabase (قاعدة البيانات وتسجيل الدخول) ويُقدَّم التطبيق عبر Vercel. قد تستضيف هذه الجهات البيانات خارج المغرب.',
          'لا يرى كل مستخدم إلا بياناته الخاصة، وتبقى كل مساحة (مثل «شخصي» أو CESAM) منفصلة عن غيرها. لا يصل الناشر إلى البيانات إلا للصيانة التقنية أو بطلب منك.']],
        ['المشاركة', ['لا نبيع بياناتك ولا نؤجرها. لا تُشارك إلا مع الجهات التقنية المذكورة أعلاه، أو عندما يوجب القانون ذلك.']],
        ['مدة الاحتفاظ', ['نحتفظ ببياناتك ما دام حسابك قائماً. وبناءً على طلبك نحذف حسابك والبيانات المرتبطة به.']],
        ['حقوقك', [`يمكنك طلب الاطلاع على بياناتك أو تصحيحها أو حذفها بمراسلتنا على ${E}. نسعى إلى احترام القانون المغربي رقم 09-08 المتعلق بحماية المعطيات الشخصية.`]],
        ['الأمان', ['الاتصال بالتطبيق مشفّر (HTTPS) والوصول إلى البيانات مقيَّد. لا يوجد نظام آمن بنسبة 100٪: اختر كلمة مرور فريدة ولا تشاركها.']],
        ['التغييرات', ['قد تتغير هذه السياسة. يظهر تاريخ آخر تحديث في أعلى الصفحة.']],
      ],
    },
  },

  terms: {
    fr: {
      title: 'Conditions d’utilisation',
      updated: 'Dernière mise à jour',
      sections: [
        ['Objet', ['« Gestion des finances » est un outil pour suivre vos dépenses, revenus, budgets, épargne et dettes, pour vous-même ou pour un groupe (par exemple les fonds d’une association).']],
        ['Votre compte', ['Vous créez un compte avec une adresse e-mail valide et un mot de passe que vous gardez confidentiel. Vous êtes responsable de l’activité faite avec votre compte.']],
        ['Utilisation correcte', ['Utilisez l’appli de façon légale. N’essayez pas d’accéder aux données d’autres personnes et ne perturbez pas le fonctionnement du service.']],
        ['Vos données', ['Ce que vous saisissez reste à vous. Vous êtes responsable de son exactitude, et de votre droit d’utiliser des informations concernant d’autres personnes ou un groupe (par exemple les fonds d’une association). Voir la Politique de confidentialité.']],
        ['Pas un conseil', ['L’appli est un outil de suivi : elle ne donne ni conseil financier, ni conseil comptable, ni conseil juridique. Les calculs sont indicatifs : comparez-les avec vos relevés bancaires.']],
        ['Disponibilité et responsabilité', ['Le service est fourni « tel quel », sans garantie qu’il soit toujours disponible ou sans erreur. Il peut évoluer ou s’interrompre. Gardez vos propres relevés. Dans la mesure permise par la loi, l’éditeur n’est pas responsable des pertes liées à l’usage de l’appli.']],
        ['Fin du compte', [`Vous pouvez demander la suppression de votre compte à tout moment : ${E}. L’éditeur peut suspendre un compte en cas d’abus.`]],
        ['Changements', ['Ces conditions peuvent évoluer. La date de dernière mise à jour figure en haut de la page ; continuer à utiliser l’appli signifie que vous acceptez la version en vigueur.']],
        ['Contact', [`Une question ? ${E}`]],
      ],
    },
    en: {
      title: 'Terms of Use',
      updated: 'Last updated',
      sections: [
        ['Purpose', ['“Gestion des finances” is a tool to track your expenses, income, budgets, savings and debts, for yourself or for a group (for example an association’s funds).']],
        ['Your account', ['You create an account with a valid email address and a password you keep confidential. You are responsible for the activity carried out with your account.']],
        ['Proper use', ['Use the app lawfully. Do not try to access other people’s data and do not disrupt the service.']],
        ['Your data', ['What you enter remains yours. You are responsible for its accuracy and for your right to use information about other people or a group (for example an association’s funds). See the Privacy Policy.']],
        ['Not advice', ['The app is a tracking tool: it does not provide financial, accounting or legal advice. Calculations are indicative: compare them with your bank statements.']],
        ['Availability and liability', ['The service is provided “as is”, with no guarantee that it will always be available or error-free. It may change or be interrupted. Keep your own records. To the extent permitted by law, the publisher is not liable for losses related to the use of the app.']],
        ['Ending your account', [`You can ask for your account to be deleted at any time: ${E}. The publisher may suspend an account in case of abuse.`]],
        ['Changes', ['These terms may change. The date of the last update is shown at the top of the page; continuing to use the app means you accept the current version.']],
        ['Contact', [`A question? ${E}`]],
      ],
    },
    es: {
      title: 'Condiciones de uso',
      updated: 'Última actualización',
      sections: [
        ['Objeto', ['«Gestion des finances» es una herramienta para seguir tus gastos, ingresos, presupuestos, ahorro y deudas, para ti o para un grupo (por ejemplo, los fondos de una asociación).']],
        ['Tu cuenta', ['Creas una cuenta con un correo válido y una contraseña que mantienes confidencial. Eres responsable de la actividad realizada con tu cuenta.']],
        ['Uso correcto', ['Usa la app de forma legal. No intentes acceder a los datos de otras personas ni perturbes el funcionamiento del servicio.']],
        ['Tus datos', ['Lo que introduces sigue siendo tuyo. Eres responsable de su exactitud y de tu derecho a usar información sobre otras personas o un grupo (por ejemplo, los fondos de una asociación). Consulta la Política de privacidad.']],
        ['No es un consejo', ['La app es una herramienta de seguimiento: no ofrece asesoramiento financiero, contable ni jurídico. Los cálculos son orientativos: compáralos con tus extractos bancarios.']],
        ['Disponibilidad y responsabilidad', ['El servicio se ofrece «tal cual», sin garantía de que esté siempre disponible o libre de errores. Puede cambiar o interrumpirse. Conserva tus propios registros. En la medida permitida por la ley, el editor no responde de las pérdidas derivadas del uso de la app.']],
        ['Fin de la cuenta', [`Puedes pedir la eliminación de tu cuenta en cualquier momento: ${E}. El editor puede suspender una cuenta en caso de abuso.`]],
        ['Cambios', ['Estas condiciones pueden cambiar. La fecha de la última actualización aparece al principio de la página; seguir usando la app implica aceptar la versión vigente.']],
        ['Contacto', [`¿Una pregunta? ${E}`]],
      ],
    },
    ar: {
      title: 'شروط الاستخدام',
      updated: 'آخر تحديث',
      sections: [
        ['الغرض', ['«Gestion des finances» أداة لتتبّع مصروفاتك وإيراداتك وميزانياتك وادخارك وديونك، لنفسك أو لمجموعة (مثل أموال جمعية).']],
        ['حسابك', ['تنشئ حساباً ببريد إلكتروني صالح وكلمة مرور تحتفظ بسريتها. أنت مسؤول عن النشاط الذي يتم عبر حسابك.']],
        ['الاستخدام السليم', ['استخدم التطبيق بشكل قانوني. لا تحاول الوصول إلى بيانات الآخرين ولا تعطّل عمل الخدمة.']],
        ['بياناتك', ['ما تُدخله يبقى ملكك. أنت مسؤول عن دقته وعن حقك في استخدام معلومات تخص أشخاصاً آخرين أو مجموعة (مثل أموال جمعية). راجع سياسة الخصوصية.']],
        ['ليس نصيحة', ['التطبيق أداة تتبّع: لا يقدّم نصائح مالية أو محاسبية أو قانونية. الحسابات استرشادية: قارنها بكشوف حسابك البنكي.']],
        ['التوفر والمسؤولية', ['تُقدَّم الخدمة «كما هي» دون ضمان توفرها دائماً أو خلوّها من الأخطاء. قد تتغير أو تتوقف. احتفظ بسجلاتك الخاصة. بالقدر الذي يسمح به القانون، لا يتحمل الناشر مسؤولية الخسائر المرتبطة باستخدام التطبيق.']],
        ['إنهاء الحساب', [`يمكنك طلب حذف حسابك في أي وقت: ${E}. يجوز للناشر تعليق حساب في حال إساءة الاستخدام.`]],
        ['التغييرات', ['قد تتغير هذه الشروط. يظهر تاريخ آخر تحديث في أعلى الصفحة؛ ومتابعة استخدام التطبيق تعني قبولك للنسخة السارية.']],
        ['التواصل', [`سؤال؟ ${E}`]],
      ],
    },
  },
};
