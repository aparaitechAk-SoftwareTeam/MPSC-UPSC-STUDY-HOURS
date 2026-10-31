/**
 * Abhyas Mitra - Friendly UPSC & MPSC Study Companion Engine
 * 100% Free, Rule-Based, Multilingual (English, Marathi, Hindi)
 * Integrated with student's actual study progress, safety protocols, and syllabus guides.
 */

const SAFETY_KEYWORDS = [
  'suicide', 'kill myself', 'end my life', 'want to die', 'give up on life', 
  'hopeless', 'depressed', 'can\'t go on', 'cant go on', 'worthless',
  'आत्महत्या', 'मरावंसं वाटतंय', 'जगायची इच्छा नाही', 'फार त्रास होतोय',
  'मरना चाहता हूँ', 'जीना नहीं चाहता', 'जिंदगी खत्म'
];

const EMOTIONAL_KEYWORDS = [
  'wasted', 'guilty', 'guilt', 'could not study', 'couldnt study', 'could not finish',
  'stressed', 'stress', 'anxiety', 'anxious', 'overwhelmed', 'demotivated', 'tired', 'burnout',
  'lost focus', 'can i clear', 'exam fear', 'fear', 'low confidence', 'lazy', 'procrastinating',
  'procrastinate', 'failure', 'fail', 'scared', 'worried',
  'वाया', 'अभ्यास झाला नाही', 'ताण', 'भीती', 'कंटाळा', 'नर्व्हस', 'दोषी', 'उदास',
  'बर्बाद', 'पढ़ाई नहीं हुई', 'तनाव', 'डर', 'हिम्मत', 'चिंता', 'निराश'
];

const PROGRESS_KEYWORDS = [
  'my progress', 'how much did i study', 'today\'s hours', 'todays hours', 'my study time',
  'progress report', 'status', 'syllabus progress',
  'माझा अभ्यास', 'आज किती अभ्यास झाला', 'प्रगती', 'अभ्यासाचे तास',
  'मेरी प्रगति', 'आज कितनी पढ़ाई हुई', 'स्टडी रिपोर्ट'
];

const FOCUS_KEYWORDS = [
  'focus', 'pomodoro', 'distraction', 'phone distraction', 'how to focus', 'concentration',
  'लक्ष लागत नाही', 'एकाग्रता', 'मोबाईल अडथळा', 'पोमोडोरो',
  'मन नहीं लग रहा', 'ध्यान कैसे लगाएं', 'फोन का भटकाव'
];

const PLAN_KEYWORDS = [
  'plan', 'schedule', 'timetable', 'what to study', 'how to start', 'routine',
  'नियोजन', 'वेळापत्रक', 'काय वाचू', 'कशी सुरुवात करू',
  'योजना', 'टाइमटेबल', 'क्या पढूं', 'शुरुआत कैसे करूं'
];

const APP_HELP_KEYWORDS = [
  'how to use timer', 'how to use planner', 'how to use syllabus', 'help', 'app guide',
  'अॅप कसे वापरावे', 'टायमर कसा वापरावा', 'प्लॅनर कसा वापरावा', 'मदत',
  'ऐप कैसे इस्तेमाल करें', 'टाइमर कैसे चलाएं', 'मदद'
];

// -------------------------------------------------------------
// Core Knowledge Base: Subjects & Concepts (UPSC & MPSC)
// -------------------------------------------------------------
const KNOWLEDGE_BASE = [
  {
    topic: 'fundamental-rights',
    patterns: ['fundamental rights', 'article 21', 'article 19', 'article 14', 'मूलभूत हक्क', 'मौलिक अधिकार', 'fr'],
    responses: {
      en: `📖 **Fundamental Rights (Part III, Articles 12–35)**\n\nFundamental Rights are guaranteed to all citizens to protect individual liberty and dignity:\n\n• **Right to Equality (Art 14–18):** Equality before law and prohibition of discrimination.\n• **Right to Freedom (Art 19–22):** Freedom of speech, assembly, and Art 21 (Protection of life & personal liberty).\n• **Right against Exploitation (Art 23–24):** Prohibition of human trafficking & child labor.\n• **Freedom of Religion (Art 25–28):** Freedom of conscience and practice.\n• **Cultural & Educational Rights (Art 29–30)**\n• **Constitutional Remedies (Art 32):** Called the 'Heart and Soul' of the Constitution by Dr. B.R. Ambedkar.\n\n💡 *Tip: Article 32 empowers the Supreme Court to issue 5 types of writs: Habeas Corpus, Mandamus, Prohibition, Certiorari, and Quo-Warranto.*`,
      mr: `📖 **मूलभूत हक्क (भाग ३, कलमे १२ ते ३५)**\n\nभारतीय राज्यघटनेने नागरिकांना सन्मानाने जगण्यासाठी ६ मूलभूत हक्क दिले आहेत:\n\n• **समानतेचा हक्क (कलम १४–१८):** कायद्यापुढे सर्व समान, भेदाभावास मनाई.\n• **स्वातंत्र्याचा हक्क (कलम १९–२२):** भाषण स्वातंत्र्य, आणि कलम २१ (जीविताचे व व्यक्तिगत स्वातंत्र्याचे संरक्षण).\n• **शोषणाविरुद्ध हक्क (कलम २३–२४):** मानवी तस्करी व बालमजुरीस बंदी.\n• **धार्मिक स्वातंत्र्याचा हक्क (कलम २५–२८)**\n• **सांस्कृतिक व शैक्षणिक हक्क (कलम २९–३०)**\n• **घटनात्मक उपायांचा हक्क (कलम ३२):** डॉ. बाबासाहेब आंबेडकरांनी या कलमाला 'घटनेचा आत्मा आणि हृदय' म्हटले आहे.\n\n💡 *टीप: कलम ३२ अन्वये सर्वोच्च न्यायालय ५ प्रकारचे प्राधिलेख (Writs) जारी करू शकते.*`,
      hi: `📖 **मौलिक अधिकार (भाग III, अनुच्छेद 12–35)**\n\nभारतीय संविधान नागरिकों की गरिमा और स्वतंत्रता की रक्षा के लिए ६ मौलिक अधिकार प्रदान करता है:\n\n• **समानता का अधिकार (अनुच्छेद 14–18):** कानून के समक्ष समानता.\n• **स्वतंत्रता का अधिकार (अनुच्छेद 19–22):** अभिव्यक्ति की स्वतंत्रता और अनुच्छेद 21 (प्राण एवं दैहिक स्वतंत्रता).\n• **शोषण के विरुद्ध अधिकार (अनुच्छेद 23–24)**\n• **धार्मिक स्वतंत्रता का अधिकार (अनुच्छेद 25–28)**\n• **संस्कृति एवं शिक्षा संबंधी अधिकार (अनुच्छेद 29–30)**\n• **संवैधानिक उपचारों का अधिकार (अनुच्छेद 32):** डॉ. बी.आर. अम्बेडकर ने इसे 'संविधान का हृदय और आत्मा' कहा है.\n\n💡 *सुझाव: अनुच्छेद 32 के तहत सुप्रीम कोर्ट ५ रिट जारी कर सकता है.*`
    }
  },
  {
    topic: 'preamble',
    patterns: ['preamble', 'सरनामा', 'प्रस्तावना', 'उद्देशिका'],
    responses: {
      en: `📖 **Preamble of the Indian Constitution**\n\nBased on Pandit Nehru's 'Objectives Resolution' (1946):\n• Declares India as a **Sovereign, Socialist, Secular, Democratic, Republic**.\n• Secures **Justice** (Social, Economic, Political), **Liberty**, **Equality**, and **Fraternity**.\n• 42nd Amendment (1976) added three key words: *Socialist, Secular, and Integrity*.\n• *Kesavananda Bharati Case (1973):* Preamble is an integral part of the Constitution and can be amended under Art 368 without altering the Basic Structure.`,
      mr: `📖 **भारतीय राज्यघटनेचा सरनामा (उद्देशिका)**\n\nपंडित नेहरूंनी मांडलेल्या उद्दिष्टांच्या ठरावावर आधारित:\n• भारताला **सार्वभौम, समाजवादी, धर्मनिरपेक्ष, लोकशाही गणराज्य** घोषित करते.\n• **न्याय** (सामाजिक, आर्थिक, राजकीय), **स्वातंत्र्य**, **समता** आणि **बंधुता** प्रस्थापित करते.\n• ४२ वी घटनादुरुस्ती (१९७६) द्वारे *समाजवादी, धर्मनिरपेक्ष, आणि एकात्मता* हे शब्द जोडले गेले.\n• *केशवानंद भारती खटला (१९७३):* सरनामा हा राज्यघटनेचा अविभाज्य भाग आहे.`,
      hi: `📖 **भारतीय संविधान की प्रस्तावना (उद्देशिका)**\n\nपंडित नेहरू के 'उद्देश्य प्रस्ताव' (1946) पर आधारित:\n• भारत को एक **सम्पूर्ण प्रभुत्व-सम्पन्न, समाजवादी, पंथनिरपेक्ष, लोकतंत्रात्मक गणराज्य** घोषित करती है.\n• **न्याय**, **स्वतंत्रता**, **समता** और **बंधुता** सुनिश्चित करती है.\n• 42वें संशोधन (1976) द्वारा *समाजवादी, पंथनिरपेक्ष और अखंडता* शब्द जोड़े गए.\n• *केशवानंद भारती केस (1973):* प्रस्तावना संविधान का अभिन्न अंग है.`
    }
  },
  {
    topic: 'western-ghats',
    patterns: ['western ghats', 'sahyadri', 'सह्याद्री', 'पश्चिम घाट', 'महाराष्ट्राचा भूगोल'],
    responses: {
      en: `⛰️ **Sahyadri & Western Ghats (MPSC & UPSC Geography)**\n\n• Forms the continuous western escarpment of the Deccan Plateau (~1600 km length, ~750 km in Maharashtra).\n• **Highest Peak in Maharashtra:** Kalsubai (1,646 m) in Ahmednagar/Nashik.\n• **Important Passes (Ghats):** Thal Ghat (Mumbai-Nashik), Bhor Ghat (Mumbai-Pune), Kumbharli Ghat (Karad-Chiplun), Amba Ghat (Kolhapur-Ratnagiri).\n• **Rivers Originated:** Godavari (Trimbakeshwar), Krishna (Mahabaleshwar), Bhima (Bhimashankar).\n• **Biodiversity Hotspot:** Designated as a UNESCO World Heritage site and one of the world's 8 'hottest hotspots' of biological diversity.`,
      mr: `⛰️ **सह्याद्री पर्वत व पश्चिम घाट (महाराष्ट्र भूगोल)**\n\n• महाराष्ट्रातील सह्याद्रीची लांबी सुमारे ७५० किमी (एकूण लांबी १६०० किमी).\n• **महाराष्ट्रातील सर्वोच्च शिखर:** कळसुबाई (१६४६ मीटर, अहमदनगर/नाशिक सीमा).\n• **प्रमुख घाटमार्ग:** थळ घाट (मुंबई-नाशिक), बोर घाट (मुंबई-पुणे), कुंभार्ली घाट (कराड-चिपळूण), आंबोली घाट (सावंतवाडी-बेळगाव).\n• **उगम पावणाऱ्या नद्या:** गोदावरी (त्र्यंबकेश्वर), कृष्णा (महाबळेश्वर), भीमा (भीमाशंकर).\n• युनेस्कोचे जागतिक वारसा स्थळ असून जैवविविधतेचे अत्यंत समृद्ध केंद्र आहे.`,
      hi: `⛰️ **पश्चिमी घाट और सह्याद्री (भूगोल)**\n\n• दक्कन के पठार का पश्चिमी किनारा (कुल लंबाई ~1600 किमी, महाराष्ट्र में ~750 किमी).\n• **महाराष्ट्र की सबसे ऊंची चोटी:** कलसुबाई (1,646 मीटर).\n• **प्रमुख दर्रे (घाट):** थाल घाट (मुंबई-नासिक), भोर घाट (मुंबई-पुणे), अंबा घाट.\n• **उद्गम नदियां:** गोदावरी, कृष्णा, भीमा.\n• यूनेस्को विश्व धरोहर स्थल और वैश्विक जैव विविधता हॉटस्पॉट.`
    }
  },
  {
    topic: 'panchayati-raj',
    patterns: ['panchayati raj', '73rd amendment', '74th amendment', 'स्थानिक स्वराज्य संस्था', 'पंचायती राज', 'ग्रामपंचायत'],
    responses: {
      en: `🏛️ **Panchayati Raj (73rd & 74th Amendments, 1992)**\n\n• **Constitutional Status:** 73rd Amendment added Part IX and the 11th Schedule (29 functional items for Panchayats).\n• **Three-Tier System:** Gram Panchayat (Village), Panchayat Samiti (Intermediate/Block), Zilla Parishad (District).\n• **Article 243D:** Mandatory reservation for SC/ST and at least 1/3rd seats for women (Maharashtra provides 50% reservation for women).\n• **State Election Commission (Art 243K)** conducts elections every 5 years.\n• **State Finance Commission (Art 243I)** reviews financial position.`,
      mr: `🏛️ **पंचायती राज (७३ वी घटनादुरुस्ती, १९९२)**\n\n• **घटनात्मक दर्जा:** ७३ व्या घटनादुरुस्तीने राज्यघटनेत भाग ९ आणि ११ वी अनुसूची जोडली (२९ विषय).\n• **त्रिस्तरीय रचना:** ग्रामपंचायत (गाव पातळी), पंचायत समिती (तालुका पातळी), जिल्हा परिषद (जिल्हा पातळी).\n• **महिला आरक्षण:** घटनेनुसार किमान ३३%, पण महाराष्ट्रात ५०% आरक्षण देण्यात आले आहे.\n• **राज्य निवडणूक आयोग (कलम २४३ K):** दर ५ वर्षांनी निवडणुका घेणे.\n• **राज्य वित्त आयोग (कलम २४३ I):** आर्थिक संसाधनांचे वाटप.`,
      hi: `🏛️ **पंचायती राज (73वां संविधान संशोधन, 1992)**\n\n• **संवैधानिक दर्जा:** भाग IX और 11वीं अनुसूची (29 विषय) शामिल किए गए.\n• **त्रिस्तरीय प्रणाली:** ग्राम पंचायत, पंचायत समिति और जिला परिषद.\n• **आरक्षण (अनुच्छेद 243D):** महिलाओं के लिए कम से कम 33% आरक्षण (महाराष्ट्र में 50%).\n• **राज्य निर्वाचन आयोग (243K):** 5 वर्ष में चुनाव कराना अनिवार्य.`
    }
  }
];

// -------------------------------------------------------------
// Interactive Mini-Quizzes
// -------------------------------------------------------------
const QUIZZES = [
  {
    question: {
      en: '🎯 **Quick Quiz:** Which Article of the Indian Constitution is called the "Heart and Soul" of the Constitution?\nA) Article 14\nB) Article 19\nC) Article 21\nD) Article 32',
      mr: '🎯 **झटपट प्रश्नमंजुषा:** भारतीय राज्यघटनेच्या कोणत्या कलमाला डॉ. आंबेडकरांनी "घटनेचा आत्मा आणि हृदय" म्हटले आहे?\nA) कलम १४\nB) कलम १९\nC) कलम २१\nD) कलम ३२',
      hi: '🎯 **त्वरित प्रश्नोत्तरी:** संविधान के किस अनुच्छेद को "संविधान का हृदय और आत्मा" कहा गया है?\nA) अनुच्छेद 14\nB) अनुच्छेद 19\nC) अनुच्छेद 21\nD) अनुच्छेद 32'
    },
    answer: 'D',
    explanation: {
      en: '✅ Correct answer is **D) Article 32** (Right to Constitutional Remedies). It allows citizens to approach the Supreme Court directly for enforcement of Fundamental Rights.',
      mr: '✅ बरोबर उत्तर आहे **D) कलम ३२** (घटनात्मक उपायांचा हक्क). यामुळे मूलभूत हक्कांच्या संरक्षणासाठी थेट सर्वोच्च न्यायालयात दाद मागता येते.',
      hi: '✅ सही उत्तर है **D) अनुच्छेद 32** (संवैधानिक उपचारों का अधिकार). यह नागरिकों को अधिकारों की रक्षा के लिए सुप्रीम कोर्ट जाने का अधिकार देता है.'
    }
  },
  {
    question: {
      en: '🎯 **Quick Quiz:** What is the highest mountain peak in Maharashtra?\nA) Salher\nB) Kalsubai\nC) Mahabaleshwar\nD) Harishchandragad',
      mr: '🎯 **झटपट प्रश्नमंजुषा:** महाराष्ट्रातील सर्वोच्च पर्वतशिखर कोणते आहे?\nA) साल्हेर\nB) कळसुबाई\nC) महाबळेश्वर\nD) हरिश्चंद्रगड',
      hi: '🎯 **त्वरित प्रश्नोत्तरी:** महाराष्ट्र की सबसे ऊंची पर्वत चोटी कौन सी है?\nA) साल्हेर\nB) कलसुबाई\nC) महाबलेश्वर\nD) हरिश्चंद्रगढ़'
    },
    answer: 'B',
    explanation: {
      en: '✅ Correct answer is **B) Kalsubai** (Height: 1,646 meters), situated on the Sahyadri range between Ahmednagar and Nashik.',
      mr: '✅ बरोबर उत्तर आहे **B) कळसुबाई** (उंची: १६४६ मीटर). हे अहमदनगर आणि नाशिक जिल्ह्यांच्या सीमेवर सह्याद्री पर्वतरांगेत आहे.',
      hi: '✅ सही उत्तर है **B) कलसुबाई** (ऊंचाई: 1,646 मीटर), जो सह्याद्री पर्वत श्रृंखला में स्थित है.'
    }
  }
];

// -------------------------------------------------------------
// Engine Process Function
// -------------------------------------------------------------
function processMitraMessage({ message = '', lang = 'en', user = null, sessions = [], plans = [], topicProgress = [] }) {
  const cleanMsg = String(message || '').trim().toLowerCase();
  const selectedLang = ['mr', 'hi', 'en'].includes(lang) ? lang : 'en';

  // 1. CRITICAL: Safety & Distress Check
  const isSafetyTrigger = SAFETY_KEYWORDS.some(k => cleanMsg.includes(k.toLowerCase()));
  if (isSafetyTrigger) {
    if (selectedLang === 'mr') {
      return {
        text: `मी तुमचा मित्र म्हणून तुमच्या पाठीशी आहे. तुम्ही एकटे नाही आहात, आणि तुमचे आयुष्य अत्यंत मोलाचे आहे. ❤️\n\nकृपया लगेच खालील अधिकृत आणि मोफत हेल्पलाइनवर संपर्क साधा. ते तुमचे ऐकून घेण्यासाठी २४ तास उपलब्ध आहेत:\n\n📞 **Tele-MANAS (मानसिक आरोग्य हेल्पलाइन):** **14416** किंवा **1800 891 4416** (मोफत)\n🚨 **आपत्कालीन मदत:** **112**\n\nकृपया तुमच्या जवळच्या मित्राशी, कुटुंबाशी किंवा विश्वासू व्यक्तीशी बोला. आम्ही तुमच्या सोबत आहोत.`,
        action: 'emergency_support',
        helpline: '14416'
      };
    } else if (selectedLang === 'hi') {
      return {
        text: `मैं आपका मित्र बनकर आपके साथ हूँ। आप अकेले नहीं हैं और आपका जीवन बहुत अनमोल है। ❤️\n\nकृपया तुरंत भारत सरकार की इस निःशुल्क और गोपनीय हेल्पलाइन से बात करें:\n\n📞 **Tele-MANAS (राष्ट्रीय मानसिक स्वास्थ्य हेल्पलाइन):** **14416** या **1800 891 4416** (Toll-Free)\n🚨 **आपातकालीन सहायता:** **112**\n\nकृपया किसी अपने, शिक्षक या काउंसलर से बात करें। यह कठिन समय भी निकल जाएगा।`,
        action: 'emergency_support',
        helpline: '14416'
      };
    }
    return {
      text: `I hear you, and please know that you are not alone. Your life is deeply valuable, far beyond any exam. ❤️\n\nPlease reach out right now to compassionate counselors who are ready to support you 24/7:\n\n📞 **Tele-MANAS (Govt of India Mental Health Helpline):** **14416** or **1800 891 4416** (Toll-Free)\n🚨 **National Emergency Helpline:** **112**\n\nPlease talk to a family member, trusted mentor, or counselor right now. We care about you deeply.`,
      action: 'emergency_support',
      helpline: '14416'
    };
  }

  // 1b. Daily Mood Check-In Handlers
  if (cleanMsg.includes('energized') || cleanMsg.includes('जोश') || cleanMsg.includes('उत्साही') || cleanMsg === '⚡ energized') {
    return {
      text: selectedLang === 'mr'
        ? `⚡ **उच्च ऊर्जा मोड चालू!**\n\nछान! आज तुमचा मेंदू अतिशय ताजा आहे. आत्ताच एखादा अवघड विषय (Polity किंवा Economy) हातात घ्या आणि ४५ मिनिटांचा खोल अभ्यास करा.\n\nचला, वेळेचा पुरेपूर उपयोग करूया!`
        : selectedLang === 'hi'
        ? `⚡ **हाई एनर्जी मोड सक्रिय!**\n\nशानदार! आपका दिमाग पूरी तरह एक्टिव है। अभी किसी कठिन विषय (राजव्यवस्था या अर्थव्यवस्था) से 45 मिनट का डीप वर्क शुरू करें.\n\nलक्ष्य की ओर मजबूत कदम बढ़ाइए!`
        : `⚡ **High Energy Mode Activated!**\n\nAwesome! Your focus and mental stamina are at their peak right now. Dive into a challenging core topic (like Polity or Economy) for an uninterrupted 45-minute sprint.\n\nLet's make this session count!`,
      action: 'start_pomodoro',
      suggestedActionLabel: '▶ Start 45m Sprint'
    };
  }

  if (cleanMsg.includes('focused') || cleanMsg.includes('एकाग्र') || cleanMsg === '😊 focused') {
    return {
      text: selectedLang === 'mr'
        ? `😊 **शांत व एकाग्र मन!**\n\nतयारीसाठी ही सर्वोत्तम मानसिक अवस्था आहे. मोबाईल सायलेंट करा, समोर एकच धडा ठेवा आणि अभ्यासाला लागा. सातत्य हेच यशाचे रहस्य आहे!`
        : selectedLang === 'hi'
        ? `😊 **एकाग्र और शांत मन!**\n\nयह पढ़ाई के लिए सबसे बेहतरीन मनोदशा है। फोन को दूर रखें, आज का 1 मुख्य लक्ष्य सामने रखें और शुरुआत करें।`
        : `😊 **Calm & Focused Mindset!**\n\nThis is the ideal state for deep learning. Put your phone in another room, pick your #1 syllabus target for today, and let's lock in!`,
      action: 'start_pomodoro',
      suggestedActionLabel: '▶ Start Focus Timer'
    };
  }

  if (cleanMsg.includes('tired') || cleanMsg.includes('थकलो') || cleanMsg.includes('थकावट') || cleanMsg === '😴 tired') {
    return {
      text: selectedLang === 'mr'
        ? `😴 **थकवा जाणवतोय? काही हरकत नाही!**\n\nस्वतःवर जबरदस्ती करू नका. एक ग्लास थंड पाणी प्या, ५ मिनिटे स्ट्रेचिंग करा. आज कठीण थेअरी ऐवजी फक्त हलके MCQs किंवा PYQs सोडवा. थोडा अभ्यासही शून्य अभ्यासापेक्षा खूप चांगला असतो!`
        : selectedLang === 'hi'
        ? `😴 **थकावट महसूस हो रही है? कोई बात नहीं!**\n\nखुद पर ज्यादा दबाव न डालें। थोड़ा पानी पिएं, 5 मिनट वॉक करें। भारी किताबों के बजाय सिर्फ हल्के MCQs या करंट अफेयर्स पढ़ें। कुछ पढ़ाई भी शून्य से बेहतर होती है!`
        : `😴 **Feeling Tired? That's completely normal!**\n\nDon't force heavy theoretical concepts right now. Drink a glass of water, do a quick 5-minute stretch, and switch to lighter tasks like MCQs, PYQs, or audio editorials. Even 20 mins beats 0 mins!`,
      action: 'start_pomodoro',
      suggestedActionLabel: '▶ Easy 20m Session'
    };
  }

  if (cleanMsg.includes('anxious') || cleanMsg.includes('ताण') || cleanMsg.includes('घबराट') || cleanMsg === '😰 anxious') {
    return {
      text: selectedLang === 'mr'
        ? `😰 **परीक्षेचा ताण आलाय? मी तुमच्या सोबत आहे.**\n\nUPSC आणि MPSC चा आवाका मोठा असल्याने भीती वाटणे साहजिक आहे. पण लक्षात ठेवा: परीक्षा संपूर्ण सिलॅबस एकदम सोडवून नव्हे, तर दररोज एकेक टॉपिक संपवून जिंकली जाते.\n\nचला, माझ्यासोबत ४ सेकंद श्वास आत घ्या... ७ सेकंद रोखा... ८ सेकंद हळूच सोडा. सर्व काही ठीक होईल! ❤️`
        : selectedLang === 'hi'
        ? `😰 **परीक्षा का तनाव? मैं आपके साथ हूँ।**\n\nइतना बड़ा सिलेबस देखकर डर लगना स्वाभाविक है। लेकिन याद रखिए: परीक्षा एक दिन में नहीं, रोज के एक-एक छोटे कदम से निकलती है।\n\nमेरे साथ 4-7-8 गहरी सांस लीजिए. आप बहुत काबिल हैं और यह दौर भी निकल जाएगा! ❤️`
        : `😰 **Feeling Anxious? Take a gentle breath with me.**\n\nExam anxiety is simply a sign that you care deeply about your dreams. But you don't have to conquer the whole exam today—only today's 1 small chapter.\n\nLet's do a 4-7-8 calming breath: Inhale for 4s... hold for 7s... exhale slowly for 8s. You are stronger than your anxiety! ❤️`,
      action: 'relax_exercise'
    };
  }

  // 1c. Study Comeback Mode (Restarting after missing days)
  if (cleanMsg.includes('comeback') || cleanMsg.includes('missed') || cleanMsg.includes('restart') || cleanMsg.includes('गॅप') || cleanMsg.includes('पुन्हा सुरुवात')) {
    return {
      text: selectedLang === 'mr'
        ? `🔄 **अभ्यास कमबॅक मोड!**\n\nकाही दिवस अभ्यास सुटला म्हणून स्वतःला दोष देऊ नका. सर्व यशस्वी विद्यार्थ्यांच्या प्रवासात असे ब्रेक येतात. महत्त्वाचे आहे परत उभे राहणे!\n\nआज एकदम १० तास अभ्यासाचा प्रयत्न करू नका. आज फक्त **२० ते २५ मिनिटे** तुमच्या आवडीचा विषय वाचा. सवय पूर्ववत करणे हेच आजचे मुख्य ध्येय आहे!`
        : selectedLang === 'hi'
        ? `🔄 **स्टडी कमबैक मोड!**\n\nकुछ दिनों का गैप आ गया? कोई बात नहीं, यह हर टॉपर के साथ होता है। सबसे महत्वपूर्ण है वापसी करना!\n\nआज 10 घंटे पढ़ने का दबाव मत लीजिए। आज केवल **20 से 25 मिनट** किसी पसंदीदा विषय से शुरुआत कीजिए। आदत दोबारा बनाना ही आज की जीत है!`
        : `🔄 **Study Comeback Mode Activated!**\n\nMissed a few days of study? That is completely human and happens to every single ranker. The magic is in the comeback!\n\nDon't punish yourself with a 10-hour target today. Our ONLY goal today is **just 20 to 25 minutes** on your favorite subject to rekindle your study rhythm. Welcome back!`,
      action: 'start_pomodoro',
      suggestedActionLabel: '▶ 20m Comeback Session'
    };
  }

  // 1d. Explain Like I'm 10 (ELI10)
  if (cleanMsg.includes("explain like i'm 10") || cleanMsg.includes("explain like i am 10") || cleanMsg.includes('eli10') || cleanMsg.includes('explain simply') || cleanMsg.includes('simple words') || cleanMsg.includes('सोप्या भाषेत') || cleanMsg.includes('सरल शब्दों') || cleanMsg.includes('eli 10') || cleanMsg.includes("explain like i'm")) {
    return {
      text: selectedLang === 'mr'
        ? `👶 **सोप्या भाषेत समजून घ्या: भारतीय राज्यव्यवस्था (Indian Polity)**\n\nआपल्या देशाला एका मोठ्या कुटुंबासारखे समजा:\n\n• **राज्यघटना (Constitution):** संपूर्ण घराचे मुख्य नियमपुस्तक, जे घरातील सर्वांना पाळावे लागते.\n• **संसद (Parliament):** कुटुंबाची बैठक, जिथे सर्व प्रतिनिधी एकत्र येऊन नवीन नियमांवर चर्चा करतात.\n• **कार्यकारिणी (PM & Ministers):** नियम पुस्तकानुसार घराची प्रत्यक्ष कामे सांभाळणारे.\n• **न्यायव्यवस्था (Supreme Court):** खेळातील निष्पक्ष पंच (Umpire), जो नियम कोणी मोडले का हे पाहतो!\n\n💡 *अशा सोप्या उदाहरणांनी विषय कायम लक्षात राहतात!*`
        : selectedLang === 'hi'
        ? `👶 **सरल शब्दों में: भारतीय राजव्यवस्था (Indian Polity)**\n\nकल्पना कीजिए कि हमारा देश एक बहुत बड़ा संयुक्त परिवार है:\n\n• **संविधान (Constitution):** घर की मुख्य नियम-पुस्तिका, जिसका सम्मान सबको करना है.\n• **संसद (Parliament):** पारिवारिक सभा, जहां सब मिलकर घर के नए नियम बनाते हैं.\n• **कार्यपालिका (PM & मंत्री):** नियमों के अनुसार देश का काम चलाने वाले.\n• **न्यायपालिका (Courts):** निष्पक्ष रेफरी (Umpire), जो देखते हैं कि कोई नियम न तोड़े!\n\n💡 *सरल उदाहरणों से कॉन्सेप्ट हमेशा के लिए याद हो जाते हैं!*`
        : `👶 **Explain Like I'm 10: Indian Polity & Governance**\n\nImagine our country as a huge family living in one big home:\n\n• **The Constitution:** The master rulebook of the house that *everyone* must respect.\n• **The Parliament:** The family meeting room where representatives gather to discuss and write new rules.\n• **The Executive (PM & Council):** The managers who make sure daily work gets done according to the rules.\n• **The Judiciary (Courts):** The fair sports referees who make sure nobody breaks the rulebook!\n\n💡 *Clear, intuitive, and exam-ready!*`,
      action: 'study_concept'
    };
  }

  // 1e. Revision Reminder & Spaced Repetition
  if (cleanMsg.includes('revision') || cleanMsg.includes('रिव्हिजन') || cleanMsg.includes('उजळणी') || cleanMsg.includes('रिवीजन')) {
    return {
      text: selectedLang === 'mr'
        ? `🔁 **स्मरणशक्ती वाढवणारे रिव्हिजन तंत्र (Spaced Repetition):**\n\n• **पहिला दिवस:** आज वाचलेले उद्या सकाळी १० मिनिटांत जलद नजरेखालून घाला.\n• **सातवा दिवस:** आठवड्याभरात वाचलेल्या महत्त्वाच्या मुद्द्यांची उजळणी.\n• **अॅक्टिव्ह रिकॉल:** पुस्तक बंद करून स्वतःला विचारा—*"या टॉपिकमधील ५ महत्त्वाचे मुद्दे कोणते?"*\n\n💡 *तुम्हाला आज कोणत्या विषयाचे रिव्हिजन करायचे आहे?*`
        : selectedLang === 'hi'
        ? `🔁 **वैज्ञानिक रिवीजन फॉर्मूला (Spaced Repetition):**\n\n• **डे 1:** आज पढ़ी हुई चीजों को कल सुबह 10 मिनट में सिर्फ एक बार सरसरी निगाह से देखें.\n• **डे 7:** पूरे हफ्ते के महत्वपूर्ण नोट्स की क्विक समीक्षा.\n• **एक्टिव रिकॉल:** किताब बंद करके याद करें कि मुख्य 5 पॉइंट्स क्या थे.\n\n💡 *आज आप किस विषय का रिवीजन करना चाहते हैं?*`
        : `🔁 **Spaced Repetition Revision Protocol:**\n\n• **Day 1 Recap:** Spend the first 10 mins of each morning reviewing yesterday's notes.\n• **Day 7 Review:** Weekly sweep of key summaries and diagrams.\n• **Active Recall:** Close the book and test yourself: *"Can I explain this topic in 3 minutes without looking?"*\n\n💡 *What subject would you like to revise today?*`,
      action: 'open_planner'
    };
  }

  // 2. Emotional Support & Motivation
  const isEmotional = EMOTIONAL_KEYWORDS.some(k => cleanMsg.includes(k.toLowerCase()));
  if (isEmotional) {
    if (cleanMsg.includes('wasted') || cleanMsg.includes('वाया') || cleanMsg.includes('बर्बाद') || cleanMsg.includes('could not study')) {
      if (selectedLang === 'mr') {
        return {
          text: `काही हरकत नाही! एक कठीण दिवस तुमची संपूर्ण तयारी ठरवत नाही. ❤️\n\nअभ्यासामध्ये असे दिवस सर्वांच्याच आयुष्यात येतात. स्वतःला दोष देऊ नका. आत्ता संपूर्ण सिलॅबसचा विचार न करता फक्त **२० मिनिटे** एका छोट्या विषयापासून सुरुवात करूया का?\n\nलक्षात ठेवा: *"सातत्य हे परिपूर्णतेपेक्षा जास्त महत्त्वाचे असते."*`,
          action: 'start_pomodoro',
          suggestedActionLabel: '▶ २० मिनिटांचा फोकस सुरू करा'
        };
      } else if (selectedLang === 'hi') {
        return {
          text: `कोई बात नहीं! एक मुश्किल दिन आपकी पूरी मेहनत और भविष्य तय नहीं करता। ❤️\n\nहर टॉपर के सफर में ऐसे दिन आते हैं। खुद को दोष मत दीजिए। अभी पूरी किताब का बोझ मत लीजिए, बस **२० मिनट** किसी आसान टॉपिक से शुरुआत करते हैं?\n\nयाद रखें: *"हर दिन एक नई शुरुआत है।"*`,
          action: 'start_pomodoro',
          suggestedActionLabel: '▶ 20 मिनट का फोकस शुरू करें'
        };
      }
      return {
        text: `That's completely okay! One difficult day does not define your entire preparation or your worth. ❤️\n\nEvery single UPSC & MPSC ranker had days when they couldn't study. Don't worry about the whole syllabus right now. How about we just sit down for **20 small minutes** on one light topic?\n\nRemember: *"Consistency beats perfection every single time."*`,
        action: 'start_pomodoro',
        suggestedActionLabel: '▶ Start 20m Focus Session'
      };
    }

    // General anxiety / overwhelm
    if (selectedLang === 'mr') {
      return {
        text: `मी समजू शकतो. एवढा मोठा सिलॅबस पाहून कोणालाही ताण येऊ शकतो. 🌿\n\nचला, एक खोल श्वास घ्या:\n• ४ सेकंद श्वास आत घ्या...\n• ७ सेकंद रोखून धरा...\n• ८ सेकंद हळूच बाहेर सोडा...\n\nतुम्हाला आज सर्व काही संपवायचे नाही. फक्त आजचे **१-२ छोटे टार्गेट्स** पूर्ण करा. मी तुमच्या सोबत आहे!`,
        action: 'relax_exercise'
      };
    } else if (selectedLang === 'hi') {
      return {
        text: `मैं पूरी तरह समझ सकता हूँ। इतना बड़ा सिलेबस देखकर तनाव होना स्वाभाविक है। 🌿\n\nएक गहरा सांस लीजिए:\n• 4 सेकंड सांस अंदर खींचिए...\n• 7 सेकंड रोक कर रखिए...\n• 8 सेकंड में धीरे-धीरे बाहर छोड़िए...\n\nआपको सब कुछ आज ही खत्म नहीं करना है। बस आज का **१ छोटा लक्ष्य** चुनिए। कदम-कदम पर सफलता मिलेगी!`,
        action: 'relax_exercise'
      };
    }
    return {
      text: `I completely understand. Looking at such a vast syllabus together can feel overwhelming to anyone. 🌿\n\nLet's do a quick 4-7-8 calming breath:\n• Inhale gently for 4 seconds...\n• Hold for 7 seconds...\n• Exhale slowly through your mouth for 8 seconds...\n\nYou don't have to conquer everything today. Just pick **one small chapter**, and celebrate completing it.`,
      action: 'relax_exercise'
    };
  }

  // 3. Dynamic Progress (Actual Student Data)
  const isProgress = PROGRESS_KEYWORDS.some(k => cleanMsg.includes(k.toLowerCase()));
  if (isProgress) {
    const todayStr = new Date().toISOString().slice(0, 10);
    const todaySessions = (sessions || []).filter(s => s.startedAt && s.startedAt.slice(0, 10) === todayStr);
    const todayMins = todaySessions.reduce((sum, s) => sum + (Number(s.minutes) || 0), 0);
    const hrs = Math.floor(todayMins / 60);
    const mins = todayMins % 60;
    const completedTasks = (plans || []).filter(p => p.date === todayStr && p.done).length;
    const pendingTasks = (plans || []).filter(p => p.date === todayStr && !p.done).length;

    if (selectedLang === 'mr') {
      return {
        text: `📊 **आजचा तुमचा अभ्यास अहवाल:**\n\n• **एकूण वेळ:** ${hrs > 0 ? `${hrs} तास ` : ''}${mins} मिनिटे\n• **सत्र संख्या:** ${todaySessions.length} स्टडी सेशन्स\n• **नियोजित कामे:** ${completedTasks} पूर्ण | ${pendingTasks} शिल्लक\n\n${todayMins >= 180 ? '🌟 उत्कृष्ट अभ्यास चालू आहे! असेच सातत्य ठेवा.' : todayMins > 0 ? '👍 छान सुरुवात झाली आहे. आज आणखी एक फोकस सेशन जोडूया!' : '⏳ आज अजून वेळ नोंदवलेली नाही. चला २५ मिनिटांचे एक छोटे सेशन सुरू करूया!'}`,
        action: 'view_progress'
      };
    } else if (selectedLang === 'hi') {
      return {
        text: `📊 **आज की आपकी स्टडी रिपोर्ट:**\n\n• **कुल समय:** ${hrs > 0 ? `${hrs} घंटे ` : ''}${mins} मिनट\n• **स्टडी सेशन्स:** ${todaySessions.length} सेशन्स पूरे हुए\n• **टास्क स्थिति:** ${completedTasks} पूरे | ${pendingTasks} बाकी\n\n${todayMins >= 180 ? '🌟 बहुत बढ़िया अनुशासन! अपनी इस लय को बनाए रखें.' : todayMins > 0 ? '👍 अच्छी प्रगति है. चलिए एक और फोकस ब्लॉक पूरा करते हैं!' : '⏳ आज अभी तक कोई सेशन लॉग नहीं हुआ है. चलिए 25 मिनट से शुरुआत करते हैं!'}`,
        action: 'view_progress'
      };
    }
    return {
      text: `📊 **Here is your study summary for today:**\n\n• **Time Logged:** ${hrs > 0 ? `${hrs}h ` : ''}${mins}m\n• **Sessions:** ${todaySessions.length} completed\n• **Daily Targets:** ${completedTasks} done | ${pendingTasks} pending\n\n${todayMins >= 180 ? '🌟 Fantastic dedication today! Keep this momentum strong.' : todayMins > 0 ? '👍 Great progress! A quick 25-minute session will push you even further.' : '⏳ No sessions logged yet today. Let\'s get started with a quick 25-minute Pomodoro session!'}`,
      action: 'view_progress'
    };
  }

  // 4. Focus & Pomodoro
  const isFocus = FOCUS_KEYWORDS.some(k => cleanMsg.includes(k.toLowerCase()));
  if (isFocus) {
    if (selectedLang === 'mr') {
      return {
        text: `⏱️ **एकाग्रता वाढवण्यासाठी 'पोमोडोरो पद्धत':**\n\n1. **२५ मिनिटे फक्त अभ्यास** (फोन सायलेंट ठेवा किंवा दुसऱ्या खोलीत ठेवा).\n2. **५ मिनिटे विश्रांती** (पाणी प्या, स्ट्रेचिंग करा).\n3. अशी ४ चक्रे झाल्यावर **१५-२० मिनिटांची मोठी विश्रांती** घ्या.\n\n💡 *टीप: मोबाईलच्या सूचनांमुळे एकाग्रता भंग होते. अभ्यास करताना फोन 'DND' मोडवर ठेवा.*`,
        action: 'start_pomodoro',
        suggestedActionLabel: '▶ २५ मिनिटांचा टायमर लावा'
      };
    } else if (selectedLang === 'hi') {
      return {
        text: `⏱️ **एकाग्रता के लिए 'पोमोडोरो तकनीक':**\n\n1. **25 मिनट सिर्फ पढ़ाई** (फोन को बिल्कुल दूर रखें).\n2. **5 मिनट का ब्रेक** (पानी पिएं, गहरी सांस लें).\n3. 4 सेशन्स के बाद **20 मिनट का लंबा ब्रेक** लें.\n\n💡 *टिप: अध्ययन की शुरुआत 1 आसान टॉपिक से करें ताकि मोमेंटम बन सके.*`,
        action: 'start_pomodoro',
        suggestedActionLabel: '▶ 25 मिनट का टाइमर शुरू करें'
      };
    }
    return {
      text: `⏱️ **Focus Mastery (The Pomodoro Technique):**\n\n1. **Study for 25 uninterrupted minutes** with phone in another room or on DND.\n2. **Take a 5-minute break** (drink water, walk around, rest your eyes).\n3. After 4 cycles, take a **longer 20-minute break**.\n\n💡 *Tip: Multitasking reduces retention by 40%. Focus on a single book and a single page.*`,
      action: 'start_pomodoro',
      suggestedActionLabel: '▶ Start 25m Focus Timer'
    };
  }

  // 5. Study Planning
  const isPlan = PLAN_KEYWORDS.some(k => cleanMsg.includes(k.toLowerCase()));
  if (isPlan) {
    if (selectedLang === 'mr') {
      return {
        text: `📅 **अभ्यास नियोजनाचा सुवर्ण नियम (UPSC & MPSC):**\n\n• **सकाळ (Slot 1 - 2.5 तास):** अवघड विषय (Polity / Economy) - जेव्हा मेंदू ताजा असतो.\n• **दुपार (Slot 2 - 2 तास):** CSAT, Maths किंवा PYQ सोडवणे.\n• **संध्याकाळ (Slot 3 - 2.5 तास):** इतिहास, भूगोल किंवा महाराष्ट्र सामान्य ज्ञान.\n• **रात्र (Slot 4 - 1 तास):** चालू घडामोडी आणि आज वाचलेल्याचे १० मिनिटांत रिव्हिजन!\n\n💡 *तुम्ही तुमच्या 'प्लॅनर' टॅबमध्ये जाऊन १-क्लिकने १० तासांचे मास्टर शेड्युल लागू करू शकता.*`,
        action: 'open_planner',
        suggestedActionLabel: '📅 प्लॅनर उघडा'
      };
    } else if (selectedLang === 'hi') {
      return {
        text: `📅 **सफल उम्मीदवारों का अध्ययन नियम:**\n\n• **सुबह (स्लॉट 1 - 2.5h):** कठिन विषय (राजव्यवस्था / अर्थव्यवस्था).\n• **दोपहर (स्लॉट 2 - 2h):** CSAT या पिछले वर्षों के प्रश्न (PYQs).\n• **शाम (स्लॉट 3 - 2.5h):** इतिहास / भूगोल / राज्य विशेष.\n• **रात (स्लॉट 4 - 1h):** करेंट अफेयर्स और त्वरित रिवीजन!\n\n💡 *आप अपने 'Planner' टैब से 1-क्लिक में पूरा 10 घंटे का शेड्यूल सेट कर सकते हैं.*`,
        action: 'open_planner',
        suggestedActionLabel: '📅 प्लानर खोलें'
      };
    }
    return {
      text: `📅 **The 4-Block UPSC / MPSC Master Schedule:**\n\n• **Morning (Block 1 - 2.5h):** Core GS (Polity or Economy) when focus is at peak.\n• **Midday (Block 2 - 2h):** CSAT problem-solving or Mock MCQs.\n• **Late Afternoon (Block 3 - 2.5h):** History, Geography, or State GK.\n• **Night (Block 4 - 1h):** Daily Editorial / Current Affairs & quick 15-min recap!\n\n💡 *You can apply this 10-hour structured template with one click right in your Planner tab.*`,
      action: 'open_planner',
      suggestedActionLabel: '📅 Open Planner'
    };
  }

  // 6. App Help
  const isHelp = APP_HELP_KEYWORDS.some(k => cleanMsg.includes(k.toLowerCase()));
  if (isHelp) {
    if (selectedLang === 'mr') {
      return {
        text: `💡 **अभ्यास ट्रॅकर अॅप मार्गदर्शक:**\n\n• **⏱️ टायमर:** स्टॉपवॉच सुरू करा किंवा पोमोडोरो सेशन लावा. लॉक मोड स्क्रीन बंद ठेवण्यास मदत करतो.\n• **📅 प्लॅनर:** आजचा किंवा उद्याचा अभ्यास प्लॅन करा. १-क्लिक मास्टर शेड्युल वापरा.\n• **📖 सिलॅबस:** UPSC आणि MPSC चे अधिकृत विषय, टॉपिक्स आणि पूर्णत्वाचे % ट्रॅक करा.\n• **📊 रिपोर्ट:** तुमचे एकूण अभ्यास तास, विषयानुसार वेळ आणि साप्ताहिक सातत्य तपासा.\n• **⚙️ ऑफलाइन अभ्यास:** सेटिंग्जमधून थेट पुस्तकी वाचनाचे तास नोंदवता येतात!`,
        action: 'app_guide'
      };
    } else if (selectedLang === 'hi') {
      return {
        text: `💡 **ऐप इस्तेमाल करने की गाइड:**\n\n• **⏱️ टाइमर:** फोकस सेशन शुरू करें और अपनी वास्तविक पढ़ाई का समय रिकॉर्ड करें.\n• **📅 प्लानर:** दिन के लक्ष्य निर्धारित करें ताकि भटकाव न हो.\n• **📖 सिलेबस:** UPSC और MPSC के विषयों को टॉपिक-दर-टॉपिक ट्रैक करें.\n• **📊 रिपोर्ट्स:** ग्राफ द्वारा जानें कि किस विषय को कितना समय दिया.\n• **⚙️ ऑफलाइन लॉग:** किताबों से पढ़े गए घंटे सेटिंग्स में जाकर आसानी से दर्ज करें!`,
        action: 'app_guide'
      };
    }
    return {
      text: `💡 **Abhyas Tracker Quick Guide:**\n\n• **⏱️ Timer:** Run deep focus sessions with built-in distraction locks and custom breaks.\n• **📅 Planner:** Schedule daily study blocks or apply the 10-hour blueprint.\n• **📖 Syllabus:** Master official UPSC & MPSC topics with real-time percentage completion.\n• **📊 Analytics:** See your study graphs, 14-day consistency streak, and subject breakdown.\n• **⚙️ Offline Mode:** Log library & textbook reading hours directly from Settings!`,
      action: 'app_guide'
    };
  }

  // 7. Mini Quiz trigger
  if (cleanMsg.includes('quiz') || cleanMsg.includes('प्रश्न') || cleanMsg.includes('टेस्ट')) {
    const q = QUIZZES[Math.floor(Math.random() * QUIZZES.length)];
    return {
      text: q.question[selectedLang] || q.question.en,
      action: 'quiz',
      quizAnswer: q.answer,
      explanation: q.explanation[selectedLang] || q.explanation.en
    };
  }

  // 8. Search Knowledge Base for Concepts (Polity, Geography, History, etc.)
  for (const item of KNOWLEDGE_BASE) {
    if (item.patterns.some(p => cleanMsg.includes(p.toLowerCase()))) {
      return {
        text: item.responses[selectedLang] || item.responses.en,
        action: 'study_concept',
        topic: item.topic
      };
    }
  }

  // 9. Friendly Default / Conversational Greeting
  if (cleanMsg.includes('hi') || cleanMsg.includes('hello') || cleanMsg.includes('namaste') || cleanMsg.includes('नमस्कार')) {
    const userName = user?.name ? user.name.split(' ')[0] : (selectedLang === 'mr' ? 'मित्रा' : selectedLang === 'hi' ? 'दोस्त' : 'Aspirant');
    if (selectedLang === 'mr') {
      return {
        text: `नमस्कार ${userName}! मी तुमचा **अभ्यास मित्र** आहे. 🎓\n\nतुमच्या UPSC आणि MPSC प्रवासात मी तुम्हाला संकल्पना समजून घेणे, अभ्यासाचे नियोजन, एकाग्रता वाढवणे आणि ताण कमी करण्यास मदत करेन.\n\nमी आज तुम्हाला कशी मदत करू? खालीलपैकी एका पर्यायावर टॅप करा किंवा तुमचा प्रश्न विचारा!`,
        action: 'greeting'
      };
    } else if (selectedLang === 'hi') {
      return {
        text: `नमस्ते ${userName}! मैं आपका **अभ्यास मित्र** हूँ। 🎓\n\nUPSC और MPSC की तैयारी में मैं आपके साथ एक दोस्त की तरह हूँ। किसी टॉपिक को समझना हो, टाइमटेबल बनाना हो या पढ़ाई का स्ट्रेस दूर करना हो, बेझिझक पूछिए!\n\nआज हम क्या पढ़ने वाले हैं? नीचे दिए गए किसी भी बटन पर क्लिक करें या अपना सवाल टाइप करें!`,
        action: 'greeting'
      };
    }
    return {
      text: `Hello ${userName}! I'm **Abhyas Mitra**, your friendly study companion. 🎓\n\nThink of me as a caring study buddy for your UPSC & MPSC journey. Whether you need a concept explained, study motivation, a Pomodoro timer, or guidance on breaking down your syllabus, I am right here with you!\n\nWhat would you like to explore today? Select an option below or type your question!`,
      action: 'greeting'
    };
  }

  // 10. Honest fallback (as specified in your requirements: rule-based honesty)
  if (selectedLang === 'mr') {
    return {
      text: `मी एक विनामूल्य अभ्यास मित्र आहे. मी मूलभूत संकल्पना, अभ्यास नियोजन, एकाग्रता आणि मानसिक आधारासाठी नेहमी तयार आहे! 💙\n\nतुम्ही मला विचारू शकता:\n• *"मूलभूत हक्क समजावून सांगा"*\n• *"सरनामा म्हणजे काय?"*\n• *"सह्याद्री पर्वताविषयी माहिती"*\n• *"आज किती अभ्यास झाला?"*\n• *"माझा दिवस वाया गेला, काय करू?"*\n• *"एकाग्रता कशी वाढवू?"*`,
      action: 'fallback_help'
    };
  } else if (selectedLang === 'hi') {
    return {
      text: `मैं आपका निःशुल्क अभ्यास मित्र हूँ! मैं मुख्य कॉन्सेप्ट्स, टाइमटेबल, एकाग्रता और प्रेरणा में आपकी पूरी मदद कर सकता हूँ। 💙\n\nआप मुझसे पूछ सकते हैं:\n• *"मौलिक अधिकार क्या हैं?"*\n• *"प्रस्तावना के बारे में बताइए"*\n• *"आज मेरी कितनी पढ़ाई हुई?"*\n• *"मन नहीं लग रहा, क्या करूँ?"*\n• *"पोमोडोरो तकनीक कैसे अपनाएं?"*`,
      action: 'fallback_help'
    };
  }
  return {
    text: `I am your free Abhyas Mitra study companion! While I don't use a paid AI API yet, I am equipped with prepared UPSC & MPSC guidance, emotional support, and live study progress. 💙\n\nHere are some things you can ask me:\n• *"Explain Fundamental Rights"*\n• *"Tell me about the Preamble"*\n• *"Western Ghats geography"*\n• *"How much did I study today?"*\n• *"I wasted my whole day. I feel guilty."*\n• *"How to use the Pomodoro technique?"*`,
    action: 'fallback_help'
  };
}

module.exports = {
  processMitraMessage,
  KNOWLEDGE_BASE,
  QUIZZES
};
