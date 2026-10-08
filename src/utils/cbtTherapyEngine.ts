/**
 * Pure Rule-Based CBT (Cognitive Behavioral Therapy) & Mindful Reflection Engine
 * 100% Client-Side • Zero External Server/API Calls • Maximum Privacy & Ethical Responsibility
 * Inspired by ELIZA, Aaron Beck's CBT Distortions & Carl Rogers' Empathetic Reflection
 * Designed for Emirhan Yılmaz (PDR Counselor & Software Developer)
 */

export interface CbtResponse {
  text: string;
  distortionTag?: string;
  suggestedExercise?: 'breathing' | 'grounding';
  suggestedFollowUps?: string[];
  isCrisis?: boolean;
}

export interface CbtMessage {
  id: string;
  sender: 'user' | 'therapist' | 'system';
  text: string;
  distortionTag?: string;
  suggestedExercise?: 'breathing' | 'grounding';
  suggestedFollowUps?: string[];
  isCrisis?: boolean;
  timestamp: number;
}

// 1. High-Priority Crisis & Emergency Interceptor
const CRISIS_PATTERNS = [
  /\bintihar\b/i,
  /\bölmek\s*istiyorum\b/i,
  /\bcanıma\s*kıy(mak|acağım|ayım)?\b/i,
  /\bkendimi\s*öldür(mek|eceğim|düm)?\b/i,
  /\bkendime\s*zarar\b/i,
  /\byaşamak\s*istemiyorum\b/i,
  /\bölsem\s*de\s*kurtulsam\b/i,
  /\bhap\s*içip\s*öl(mek)?\b/i,
  /\bkollarımı\s*kes(mek)?\b/i,
  /\byaşamıma\s*son\s*ver\b/i,
  /\bhayatıma\s*son\b/i,
  /\bi\s*want\s*to\s*die\b/i,
  /\bsuicide\b/i,
  /\bkill\s*myself\b/i,
  /\bhurt\s*myself\b/i
];

export const CRISIS_EMERGENCY_DATA = {
  title: "Yalnız Değilsin, Yanındayız. Lütfen Hemen Destek Al.",
  titleEn: "You Are Not Alone. Please Reach Out for Immediate Help.",
  message: "Şu an hissettiğin acı ve çaresizlik çok yoğun olabilir, ancak bu karanlıkta tek başına değilsin. Sana yardımcı olmak için 7/24 hazır bekleyen profesyonel uzmanlar var:",
  messageEn: "The pain you feel right now might be overwhelming, but you do not have to carry it alone. Compassionate professionals are available 24/7:",
  hotlines: [
    {
      name: "112 Acil Çağrı Merkezi",
      desc: "Hayati tehlike ve acil kriz müdahalesi (Ücretsiz / 7 gün 24 saat)",
      number: "112",
      badge: "ACİL / HAYATİ"
    },
    {
      name: "182 MHRS - Ruh Sağlığı & Psikiyatri Randevu",
      desc: "Devlet hastaneleri ve uzman psikiyatri hekimliği randevusu",
      number: "182",
      badge: "UZMAN DESTEĞİ"
    },
    {
      name: "183 Sosyal Destek & Danışma Hattı",
      desc: "Aile, kadın, gençlik ve sosyal kriz destek hattı (T.C. Bakanlığı)",
      number: "183",
      badge: "DANIŞMA"
    }
  ]
};

// 2. CBT Cognitive Distortions (Bilişsel Çarpıtmalar)
interface DistortionRule {
  regex: RegExp;
  tagTr: string;
  tagEn: string;
  descriptionTr: string;
  descriptionEn: string;
  reflectionsTr: string[];
  reflectionsEn: string[];
}

const DISTORTION_RULES: DistortionRule[] = [
  {
    regex: /\b(asla|her\s*zaman|hiçbir\s*zaman|hiçbir\s*şey|hep\s*bana|tamamen\s*mahvoldu|ya\s*hep\s*ya\s*hiç|hiç\s*kimse|hep\s*böyle|sıfırım)\b/i,
    tagTr: "Ya Hep Ya Hiç Düşüncesi (Kutuplaşmış Zihin)",
    tagEn: "All-or-Nothing / Polarized Thinking",
    descriptionTr: "Olayları siyah ya da beyaz, tam bir başarı ya da tam bir başarısızlık olarak görme eğilimi.",
    descriptionEn: "Viewing situations in black-and-white categories with no middle ground.",
    reflectionsTr: [
      "Şu an durumu ya 'kusursuz bir başarı' ya da 'tam bir hüsran' olarak iki uç kutupta değerlendiriyor olabilir misin? Hayat çoğunlukla siyah ve beyazın arasında, zengin gri tonlarda akar. Sence bu durumda gözden kaçırdığın ara renkler neler olabilir?",
      "'Asla' veya 'her zaman' gibi mutlak kelimeler zihnimizi bir kafese hapseder. Bu durumun geçerli olmadığı ya da en azından küçük bir parçanın iyi gittiği geçmiş bir anı hatırlayabiliyor musun?",
      "Bir durumun %100 kusursuz olmaması, onun %0 (değersiz) olduğu anlamına gelmez. Sence bugün attığın küçük de olsa olumlu bir adım var mıydı?"
    ],
    reflectionsEn: [
      "Could you be evaluating this in black-and-white absolutes? Life rarely exists in extremes; it's mostly lived in the shades of gray. What middle ground might be hidden right now?",
      "Words like 'never' or 'always' often trap our minds. Can you recall a single exception when things went differently than this absolute statement?",
      "Something not being 100% perfect does not mean it's 0% worth. What is one small partial success you can acknowledge today?"
    ]
  },
  {
    regex: /\b(mahvoldum|bittim|kıyamet|hayatım\s*bitti|dünyanın\s*sonu|rezil\s*oldum|öleceğim|artık\s*geri\s*dönüşü\s*yok|felaket)\b/i,
    tagTr: "Felaketleştirme (Kıyamet Senaryosu)",
    tagEn: "Catastrophizing",
    descriptionTr: "Olumsuz bir olasılığı orantısız biçimde büyüterek dünyanın sonu gibi algılama.",
    descriptionEn: "Magnifying negative outcomes and assuming the worst possible catastrophe will happen.",
    reflectionsTr: [
      "Zihninin seni hızla en uç ve en felaket senaryoya sürüklediğini fark ediyorum. Derin bir nefes alıp kendine şunu sorabilir misin: 'Korktuğum en kötü şey gerçekleşse bile, geçmişte nice zorlukları aşmış olan ben, bununla adım adım nasıl baş edebilirim?'",
      "Korktuğumuz senaryoların gerçekleşme ihtimali çoğu zaman zihnimizin çizdiği tablodan çok daha düşüktür. Bu durumun olabilecek 'en gerçekçi' ve 'orta düzey' sonucu sence ne olurdu?",
      "Bu olaya bundan 6 ay ya da 1 yıl sonra baktığında, şu an hissettiğin kadar devasa bir felaket gibi görünecek mi sence?"
    ],
    reflectionsEn: [
      "It sounds like your mind is jumping directly to the worst-case scenario. Take a slow breath and ask yourself: 'Even if the worst happened, what resilient inner strengths could I use to cope?'",
      "Our anxiety tends to overestimate risk and underestimate our coping capacity. What is the most realistic, probable outcome here rather than the absolute catastrophe?",
      "If you look back at this exact moment 12 months from now, do you think it will carry the same devastating weight it feels like today?"
    ]
  },
  {
    regex: /\b(benden\s*nefret\s*ediyor|kesin\s*öyle\s*düşünüyor|aptal\s*olduğumu\s*düşündü|beni\s*sevmiyorlar|biliyorum\s*kötü\s*olacak|başarısız\s*olacağım\s*kesin|herkes\s*bana\s*bakıyor|biliyorum\s*olmayacak)\b/i,
    tagTr: "Zihin Okuma & Geleceği Okuma (Varsayımsallık)",
    tagEn: "Mind Reading & Fortune Telling",
    descriptionTr: "Karşı tarafın ne düşündüğünü ya da geleceğin sonucunu kanıt olmadan kesin varsayma.",
    descriptionEn: "Assuming you know what others think of you or predicting a negative future without factual evidence.",
    reflectionsTr: [
      "Diğer insanların senin hakkındaki düşüncelerini ya da henüz yaşanmamış geleceği kesin bir gerçek gibi okumaya çalışıyor olabilir misin? Bu düşünceni destekleyen somut kanıtların var mı, yoksa zihninin kurguladığı bir senaryo mu?",
      "Karşı tarafın zihnini okumak yerine, 'Ben sadece kendi davranışlarımdan ve duygularımdan sorumluyum' demeyi deneseydin, içindeki bu gerginlik nasıl hafiflerdi?",
      "Geleceğe dair yazdığın bu olumsuz senaryonun tam tersinin, yani işlerin yolunda gitmesinin ihtimali sence nedir?"
    ],
    reflectionsEn: [
      "Could you be attempting to read other people's minds or predicting the future without concrete proof? What tangible facts support this conclusion versus assumptions?",
      "If you let go of trying to predict how others perceive you and instead focused purely on what you can control, how would your shoulders feel right now?",
      "What if the opposite of your negative prediction happened? What evidence is there that things could turn out surprisingly okay?"
    ]
  },
  {
    regex: /\b(herkes\s*böyle|hiç\s*şansım\s*yok|her\s*defasında|bütün\s*insanlar|hep\s*aynı\s*şey|hiçbir\s*zaman\s*yüzüm\s*gülmedi)\b/i,
    tagTr: "Aşırı Genelleme (Hızlı Yargılama)",
    tagEn: "Overgeneralization",
    descriptionTr: "Tek bir olumsuz deneyimden yola çıkarak bunu tüm hayata yayma.",
    descriptionEn: "Taking a single negative event as an unending pattern of defeat.",
    reflectionsTr: [
      "Tek bir olumsuz deneyim ya da birkaç kötü gün üzerinden tüm hayatını ve geleceğini genelliyor olabilir misin? Bu durumun bir istisnası olan geçmiş güzel bir anını anımsayalım mı?",
      "Bugün yaşanan bir pürüz, senin tüm yolculuğunun özeti değildir; yalnızca yol üzerindeki tek bir virajdır. Bu virajı geçici bir durak olarak görmek nasıl hissettirir?",
      "'Herkes' ya da 'her şey' dediğimizde kendimize haksızlık ederiz. Sence bu durumda senin yanında olan ya da iyi niyet besleyen kimler var?"
    ],
    reflectionsEn: [
      "Are you treating a single isolated experience as if it defines your entire life story? Can you think of an instance where this generalization was proven wrong?",
      "A rough bump on the road does not mean the entire journey is ruined; it's merely one checkpoint. What if this setback is just temporary data, not destiny?",
      "When we say 'everyone' or 'always', we overlook the allies and calm moments. Who or what has been supportive in your life recently?"
    ]
  },
  {
    regex: /\b(yapmalıydım|etmeliydim|mükemmel\s*olmalı|hata\s*yapmamalıyım|asla\s*pes\s*etmemeliyim|kusursuz\s*olmalı|öyle\s*olmamalıydı|olmalıydım)\b/i,
    tagTr: "Katı Kurallar (Melı / Malı Baskısı)",
    tagEn: "'Should' & 'Must' Statements",
    descriptionTr: "Kendine ya da başkalarına karşı esnemeyen, katı ve baskıcı beklentiler yükleme.",
    descriptionEn: "Torturing oneself with rigid expectations and tyrannical demands.",
    reflectionsTr: [
      "Kendine koyduğun bu 'meli/malı' kuralları üzerinde boğucu bir suçluluk ve yetersizlik baskısı yaratıyor olabilir. 'Hata yapmamalıyım' yerine 'İnsanım, öğreniyorum ve hata yapma lüksüm var' deseydin içindeki ses nasıl yumuşardı?",
      "Mükemmeliyetçilik bazen koruyucu bir kalkan gibi görünür ama aslında ilerlememizi durduran en büyük frendir. 'Mükemmel' olmak yerine 'yeterince iyi' olmak bugün sana ne kazandırırdı?",
      "En çok sevdiğin bir dostun aynı durumda olsa ona 'bunu kesinlikle yapmalıydın' diye yüklenir miydin, yoksa şefkatle elini mi tutardın?"
    ],
    reflectionsEn: [
      "These strict 'shoulds' and 'musts' often generate immense inner guilt. What happens if you replace 'I must be flawless' with 'I am human, growing, and allowed to make errors'?",
      "Perfectionism masquerades as high standards, but it's often fear in disguise. What would 'good enough for today' look like right now?",
      "If your closest, most cherished friend were in your shoes, would you demand they 'should have done better', or would you offer compassionate understanding?"
    ]
  },
  {
    regex: /\b(ben\s*bir\s*aptalım|ezik|beceriksizim|yetersizim|salağım|işe\s*yaramazın\s*tekiyim|aptalın\s*tekiyim|çöpüm|değersizim)\b/i,
    tagTr: "Olumsuz Etiketleme (Benlik Yargılama)",
    tagEn: "Labeling & Self-Judgment",
    descriptionTr: "Belirli bir eylemi eleştirmek yerine bütün benliğe küçültücü bir sıfat yapıştırma.",
    descriptionEn: "Attaching a global negative label to oneself instead of describing a specific behavior.",
    reflectionsTr: [
      "Bir eylemdeki pürüzü ya da zorluğu alıp doğrudan bütün kişiliğine ve öz değerine bir etiket olarak yapıştırıyorsun. Bir hata yapmak seni 'beceriksiz' yapmaz; sadece deneyimleyen bir insan yapar.",
      "Kelimeler zihnimizin yapı taşlarıdır. Kendine karşı bu kadar acımasız konuşurken, içindeki o yorgun tarafı daha da hırpalamış olmuyor musun? Gel, o etiketi nazikçe sökelim.",
      "Geçmişte başarıyla tamamladığın, gurur duyduğun ya da birine destek olduğun bir anı hatırla. O andaki insan ile şu anki insan aynı kişi değil mi?"
    ],
    reflectionsEn: [
      "You are attaching a harsh global label to your entire being because of an imperfect situation. Making a mistake does not make you a failure; it simply makes you a learning human.",
      "The language we use with ourselves deeply shapes our nervous system. Notice how heavy that label feels. Would you speak to a beloved child with that same sharpness?",
      "Recall a time you handled a difficult challenge with grace or helped someone out. You are that same resilient person right now."
    ]
  },
  {
    regex: /\b(benim\s*suçum|hepsi\s*benden\s*kaynaklandı|ben\s*olmasaydım|benim\s*yüzümden\s*oldu|suçlu\s*benim)\b/i,
    tagTr: "Kişiselleştirme (Aşırı Sorumluluk Yükleme)",
    tagEn: "Personalization",
    descriptionTr: "Kontrolü dışındaki olayların sorumluluğunu tek başına üstlenme.",
    descriptionEn: "Holding yourself personally responsible for events that are not entirely under your control.",
    reflectionsTr: [
      "Kontrolün dışındaki yüzlerce faktörü ve diğer insanların da payı olduğunu göz ardı edip tüm faturayı kendine kesiyor olabilir misin? Bu resimde senin kontrol edemediğin neler vardı?",
      "Sorumluluk almak erdemdir, fakat dünyadaki her aksaklığın mimarı sen olamazsın. Kendi payın dışındaki yükleri yere bırakmaya izin verir misin?",
      "Bu olayın gerçekleşmesinde senin dışındaki koşulların, zamanlamanın ve çevresel etkenlerin payı sence yüzde kaçtı?"
    ],
    reflectionsEn: [
      "Could you be shouldering 100% of the blame for a situation shaped by numerous outside factors and other people? What parts of this equation were genuinely outside your control?",
      "Taking ownership is noble, but carrying the weight of the universe is exhausting. Can you give yourself permission to drop the luggage that isn't yours?",
      "If we drew a pie chart of all factors influencing this outcome, how much of it was timing, circumstances, and other people?"
    ]
  },
  {
    regex: /\b(başarısız\s*hissediyorum\s*öyleyse|kötü\s*hissediyorsam\s*kötüyüm|korkuyorsam\s*tehlikedeyim|suçlu\s*hissediyorum\s*demek\s*ki)\b/i,
    tagTr: "Duygusal Mantık Yürütme (Hisleri Kanıt Sayma)",
    tagEn: "Emotional Reasoning",
    descriptionTr: "Yoğun bir duygu hissedildiği için durumun gerçekten öyle olduğuna inanma.",
    descriptionEn: "Assuming that your negative emotions necessarily reflect the objective reality.",
    reflectionsTr: [
      "Duygularımız gerçektir, vücudumuzda hissedilir ve çok değerlidir; fakat her zaman dış dünyanın nesnel gerçeğini yansıtmazlar. 'Başarısız hissetmen', senin 'başarısız olduğun' anlamına gelmez.",
      "Şu an içinde fırtına kopuyor olabilir. Fırtınanın varlığı havanın her zaman yağmurlu kalacağını göstermez. Duygunun içinden geçmesine izin verip gerçek olgulara odaklanalım mı?",
      "Bu hissi bir anlığına masanın üstüne koysak ve sadece somut verilere baksak; elindeki gerçekler ne söylüyor?"
    ],
    reflectionsEn: [
      "Our emotions are real bodily sensations, but feelings are not facts. Feeling incompetent does not prove you are incompetent.",
      "An emotional storm feels overwhelming in the moment, but weather always clears. If we look strictly at verifiable evidence rather than current mood, what is truly true?",
      "Let's gently separate how you feel right now from what you have actually achieved. What are three objective facts about your capabilities?"
    ]
  }
];

// 3. Emotion States (Bilişsel & Duygu Durumu Eşleştirmeleri)
interface EmotionRule {
  regex: RegExp;
  category: string;
  responseTr: string;
  responseEn: string;
  exercise?: 'breathing' | 'grounding';
}

const EMOTION_RULES: EmotionRule[] = [
  {
    regex: /\b(nefes|soluk|breath|4-7-8|sakinleşme nefesi|nefes alalım|birlikte nefes)\b/i,
    category: "Somatik Nefes & Sakinleşme",
    responseTr: "Harika bir karar. Zihninin koşturmacasını bir anlığına durduralım. Omuzlarını hafifçe serbest bırak, arkana sakince yaslan. Başlıktaki nefes rehberine odaklanalım; birlikte burnumuzdan derin bir nefes alıp yavaşça verelim... 🌬️",
    responseEn: "A wonderful choice. Let's pause the mental rush. Soften your shoulders and lean back. Focus on the breathing guide above; let's take a deep breath together and let go... 🌬️",
    exercise: 'breathing'
  },
  {
    regex: /\b(kaygı|kaygılı|anksiyete|panik|kalbim\s*çarpıyor|nefes\s*alamıyorum|korkuyorum|içim\s*daralıyor|tedirginim)\b/i,
    category: "Kaygı & Anksiyete",
    responseTr: "Kaygının bedeninde oluşturduğu o gerginliği ve kalp çarpıntısını çok iyi anlıyorum. Kaygı, zihnimizin bizi korumak için çaldığı abartılı bir yangın alarmı gibidir; her zaman gerçek bir yangın olduğu anlamına gelmez. Bedenini güvende hissettirmek için birlikte mini bir 4-7-8 nefes egzersizi yapalım mı? Aşağıdaki nefes aracını deneyebilirsin. 🌿",
    responseEn: "I deeply hear the tension and rapid heartbeat anxiety brings. Anxiety is like an oversensitive smoke alarm trying to protect you; it doesn't mean there's an actual fire. Let's ground your nervous system with a gentle 4-7-8 breathing exercise below. 🌿",
    exercise: 'breathing'
  },
  {
    regex: /\b(tükendim|tükenmiş|enerjim\s*bitti|hiçbir\s*şey\s*yapasım\s*yok|bıktım|dayanamıyorum|yoruldum|tükendim\s*artık|pilim\s*bitti)\b/i,
    category: "Tükenmişlik & Aşırı Yüklenme",
    responseTr: "Omuzlarındaki yükün ağırlığını ve tükenmişliğini hissedebiliyorum. Sürekli güçlü olmak, her şeye yetişmek zorunda değilsin. Bedenin ve zihnin şu an sana 'Lütfen biraz dur ve bana izin ver' diyor. Bugün kendine hiçbir şey üretmek zorunda olmadığın, sadece var olabileceğin 15 dakikalık bir mola hediye edebilir misin?",
    responseEn: "I can feel the immense weight on your shoulders. You do not have to be superhuman every second. Your body and mind are gently asking for a pause. Can you grant yourself permission for a 15-minute sanctuary today where you don't have to produce anything?",
    exercise: 'grounding'
  },
  {
    regex: /\b(erteleyip\s*duruyorum|başlayamıyorum|ertelemek|odaklanamıyorum|masaya\s*oturamıyorum|erteledim|üşeniyorum)\b/i,
    category: "Erteleme & Başlama Felci",
    responseTr: "Erteleme çoğu zaman tembellikten değil; 'mükemmel yapamayacağım korkusu' ya da görev karşısında hissedilen yoğun kaygıdan doğar. Gel kuralı basitleştirelim: Bütün projeyi bitirmek zorunda değilsin. Sadece '5 Dakika Kuralı'nı uygula; saati 5 dakikaya kur ve bitirmek için değil, sadece 5 dakika dokunmak için masaya otur. 5 dakika sonra bırakma hakkın saklı. Nasıl hissettiriyor?",
    responseEn: "Procrastination is rarely laziness; it's almost always a protective shield against performance anxiety or fear of imperfection. Let's dismantle it with the 5-Minute Rule: Commit to working on it for just 5 minutes with total permission to stop. How does that feel?"
  },
  {
    regex: /\b(sınav|yks|kpss|ags|mülakat|iş\s*görüşmesi|sunum|performans)\b/i,
    category: "Sınav & Performans Kaygısı",
    responseTr: "Sınav veya değerlendirilme süreçleri zihnimizde 'bütün geleceğimin tek bir güne bağlı olduğu' illüzyonunu yaratır. Oysa bir sınav senin yalnızca o günkü belirli bilgi kurgunu ölçer; senin zekanı, potansiyelini, insanlığını ve geleceğini asla ölçemez. Elinden geleni yaptığını bilmek ve sonuca değil sürece odaklanmak omzundaki bu yükü nasıl hafifletirdi?",
    responseEn: "High-stakes evaluations trick our minds into believing our entire human worth hinges on a single score. A test measures memory retention on one afternoon; it never measures your human worth or resilience. Focus on preparation, not perfection."
  },
  {
    regex: /\b(yalnız|yalnızım|kimse\s*anlamıyor|yapayalnızım|kimsem\s*yok|anlaşılmıyorum|terk\s*edildim)\b/i,
    category: "Yalnızlık & Anlaşılma İhtiyacı",
    responseTr: "Kalabalıklar içinde dahi olsa anlaşılmadığını hissetmek insanı derinden yaralayabilir. Şu an hissettiğin bu yalnızlık hissi çok sahici ve geçerli. Ancak bilmeni isterim ki yalnızlık kalıcı bir kader değil, ruhunun derin bir bağ ve şefkat arayışıdır. Kendine şu an şefkatle yaklaşsan, içindeki o kırılgan parçaya ne söylemek isterdin?",
    responseEn: "Feeling unheard or isolated carries a deep ache. Your need for genuine connection is completely valid. Remember, loneliness is not your permanent identity; it is your soul's desire for warmth and authenticity. What gentle words can you offer yourself right now?"
  },
  {
    regex: /\b(uyuyamıyorum|uyku\s*tutmuyor|gece\s*uyku|uykusuzluk|düşünceler\s*susmuyor)\b/i,
    category: "Uykusuzluk & Zihinsel Gevezelik",
    responseTr: "Yastığa başını koyduğunda gün boyu ertelenen düşüncelerin bir anda hücum etmesi çok yıpratıcıdır. Yatakta dönüp durmak kaygıyı artırır. Eğer 20 dakikadır uyuyamadıysan, yataktan kalkıp loş bir ışıkta kağıt kalem alıp aklından geçenleri filtresizce kağıda dökmeyi ('zihin boşaltımı') dener misin? Kağıt o yükü taşır, beynin taşımak zorunda kalmaz.",
    responseEn: "When the lights go out, the unresolved thoughts of the day rush to the surface. If you've been tossing and turning, try a 'brain dump': sit in dim light and write down everything racing through your mind. Let paper hold the thoughts so your brain can rest.",
    exercise: 'breathing'
  },
  {
    regex: /\b(öfke|öfkeliyim|çıldıracağım|sinirliyim|patlayacağım|haksızlık|nefret\s*ediyorum)\b/i,
    category: "Öfke & Haksızlık Algısı",
    responseTr: "Öfke, genellikle bir sınırımızın ihlal edildiğini veya haksızlığa uğradığımızı haber veren güçlü bir ikaz lambasıdır. Öfkelenmekte son derece haklı olabilirsin. Önemli olan öfkenin sana ne anlatmak istediğini dinlemek: Bu öfkenin altında kırılmış bir gurur mu, yoksa duyulmamış bir çaresizlik mi yatıyor sence?",
    responseEn: "Anger is an emotional boundary alarm signaling an injustice or crossed line. Your anger is valid. The key is listening to what lies beneath: is there wounded pride, grief, or an unspoken need for respect?"
  }
];

// 4. Rogerian & Socratic Fallback Responses (When no exact distortion matches)
const FALLBACK_REFLECTIONS_TR = [
  "Bunu benimle paylaştığın için teşekkür ederim. Söylediklerini dinlerken, bu durumun zihninde önemli bir yer kapladığını hissediyorum. Biraz daha açmak ister misin; bu durumun seni en çok zorlayan kısmı neresi?",
  "Anlattıklarında çok derin bir içgörü seziyorum. Eğer şu an hissettiğin bu duyguya dışarıdan şefkatli bir gözlemci gibi bakabilseydin, kendine ne tavsiye ederdin?",
  "Duygularını bu kadar açık ifade edebilmen büyük bir cesaret. Bu durumun içinde senin elinde olan, değiştirebileceğin küçük bir ayrıntı var mı?",
  "Zihnimiz bazen bir düşünceyi gerçekliğin ta kendisi sanabilir. Bu konuyu düşündüğünde bedeninde (omuzlarında, göğsünde, karnında) fiziksel olarak ne hissediyorsun?",
  "Bu deneyim sana kendi değerlerin, sınırların ve önceliklerin hakkında ne öğretiyor olabilir? Birlikte derinleştirelim."
];

const FALLBACK_REFLECTIONS_EN = [
  "Thank you for sharing this with me. As I listen, I sense how deeply this matters to you. Could you unpack what specific part of this weighs on you the most?",
  "There is profound awareness in what you just expressed. If you looked at your situation as a compassionate, loving observer, what gentle advice would you offer yourself?",
  "Naming our experiences takes courage. Within this circumstance, what is one tiny aspect that genuinely remains within your direct control?",
  "Our minds often mistake a repetitive thought for factual truth. Where in your body do you physically feel the resonance of this emotion right now?",
  "What might this challenge be teaching you about your core values, boundaries, or what truly matters to you?"
];

// 5. Core Engine Processor
export function processCbtInput(rawInput: string, lang: 'tr' | 'en' = 'tr'): CbtResponse {
  const isEn = lang === 'en';
  const clean = (rawInput || '').trim();

  if (!clean) {
    return {
      text: isEn 
        ? "I am here, listening without judgment. Feel free to share whatever thought or emotion is resting on your mind. 🌿"
        : "Buradayım, seni tüm şefkatimle ve yargısızca dinliyorum. Zihninde yer kaplayan her ne varsa dilediğince paylaşabilirsin. 🌿"
    };
  }

  // Step 1: Crisis Interceptor (Absolute Priority)
  for (const pattern of CRISIS_PATTERNS) {
    if (pattern.test(clean)) {
      return {
        text: isEn ? CRISIS_EMERGENCY_DATA.messageEn : CRISIS_EMERGENCY_DATA.message,
        isCrisis: true
      };
    }
  }

  // Step 2: Cognitive Distortion Detection (BDT Çarpıtma Analizi)
  for (const rule of DISTORTION_RULES) {
    if (rule.regex.test(clean)) {
      const reflections = isEn ? rule.reflectionsEn : rule.reflectionsTr;
      const chosen = reflections[Math.floor(Math.random() * reflections.length)];
      return {
        text: chosen,
        distortionTag: isEn ? rule.tagEn : rule.tagTr,
        suggestedFollowUps: isEn
          ? ["Let's reframe this thought", "What small step can I take?", "Explore the opposite evidence"]
          : ["Bu düşünceyi yeniden çerçeveleyelim", "Bugün atabileceğim küçük adıma bakalım", "Karşıt kanıtları inceleyelim"]
      };
    }
  }

  // Step 3: Emotional Pattern Matching
  for (const rule of EMOTION_RULES) {
    if (rule.regex.test(clean)) {
      return {
        text: isEn ? rule.responseEn : rule.responseTr,
        suggestedExercise: rule.exercise,
        suggestedFollowUps: isEn
          ? ["Take a deep mindful breath", "Break this down into 1 step", "Tell me more about this feeling"]
          : ["Derin bir sakinleşme nefesi alalım", "Bunu tek bir adıma indirelim", "Bu hissi biraz daha açmak istiyorum"]
      };
    }
  }

  // Step 4: Socratic / Rogerian Empathetic Fallback
  const fallbacks = isEn ? FALLBACK_REFLECTIONS_EN : FALLBACK_REFLECTIONS_TR;
  const fallbackText = fallbacks[Math.floor(Math.random() * fallbacks.length)];
  return {
    text: fallbackText,
    suggestedFollowUps: isEn
      ? ["I want to share more", "How can I calm my mind?", "Let's do a thought record"]
      : ["Bunu biraz daha açmak istiyorum", "Zihnimi nasıl sakinleştirebilirim?", "Düşünce kaydı yapalım"]
  };
}

// 6. Grounding Exercises Data
export const GROUNDING_54321_TR = [
  "👁️ Gözünle görebildiğin 5 somut nesneye odaklan.",
  "✋ Dokunabildiğin 4 farklı yüzeyi hisset (kıyafetin, masa, zemin).",
  "👂 Kulağına gelen 3 farklı sesi dinle (nefesin, rüzgar, ortam sesi).",
  "👃 Burnuna gelen 2 farklı kokuyu fark et.",
  "👅 Ağzındaki 1 tadı ya da dilinin damağına değdiği hissi duyumsa."
];

export const GROUNDING_54321_EN = [
  "👁️ Acknowledge 5 things you can see around you.",
  "✋ Feel 4 things you can physically touch (fabric, desk, floor).",
  "👂 Notice 3 distinct sounds in your environment.",
  "👃 Catch 2 scents or aromas in the air.",
  "👅 Notice 1 taste or the sensation of your tongue resting."
];
