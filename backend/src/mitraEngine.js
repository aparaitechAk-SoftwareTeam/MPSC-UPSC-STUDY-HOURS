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
  'how to focus', 'cannot focus', "can't focus", 'focus technique', 'focus timer', 'deep focus',
  'pomodoro', 'distraction', 'phone distraction', 'concentration', 'start timer', 'start focus',
  'लक्ष लागत नाही', 'एकाग्रता', 'मोबाईल अडथळा', 'पोमोडोरो', 'टायमर', 'टायमर सुरू',
  'मन नहीं लग रहा', 'ध्यान कैसे लगाएं', 'फोन का भटकाव', 'टाइमर', 'टाइमर शुरू'
];

const PLAN_KEYWORDS = [
  'plan', 'planning', 'study plan', 'study planning', 'study help', 'help me study', 'help with study',
  'timetable', 'time table', 'schedule', 'routine', 'what to study', 'how to start', 'how to study',
  'what study help', 'what study help should i do', 'study routine', 'daily routine',
  'नियोजन', 'वेळापत्रक', 'अभ्यास नियोजन', 'अभ्यास प्लॅन', 'अभ्यास वेळापत्रक', 'अभ्यास मदत',
  'काय वाचू', 'कशी सुरुवात करू',
  'योजना', 'टाइमटेबल', 'स्टडी प्लान', 'स्टडी प्लानिंग', 'स्टडी हेल्प',
  'क्या पढूं', 'शुरुआत कैसे करूं', 'पढ़ाई की योजना'
];

const APP_HELP_KEYWORDS = [
  'how to use timer', 'how to use planner', 'how to use syllabus', 'app guide',
  'अॅप कसे वापरावे', 'टायमर कसा वापरावा', 'प्लॅनर कसा वापरावा',
  'ऐप कैसे इस्तेमाल करें', 'टाइमर कैसे चलाएं'
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
// Interactive Meta AI Study Planner Helpers
// -------------------------------------------------------------
function checkHasStudyParameters(cleanMsg) {
  // Hours check
  if (/\b(\d+(?:\.\d+)?)\s*(?:hours?|hrs?|hr|तास|घंटे|घंटा)\b/i.test(cleanMsg)) return true;
  if (['10 hours', '8 hours', '6 hours', '4 hours', '3 hours', '2 hours', '१० तास', '८ तास', '६ तास', '४ तास', '३ तास', '२ तास', '10 घंटे', '8 घंटे', '6 घंटे', '4 घंटे', '3 घंटे', '2 घंटे'].some(h => cleanMsg.includes(h))) return true;

  // Working / full-time check
  if (['working', 'job', 'office', 'नोकरी', 'जॉब', 'कामकाजी', 'full time', 'पूर्णवेळ', 'फुल टाइम'].some(w => cleanMsg.includes(w))) return true;

  // Specific subjects
  if (['polity', 'constitution', 'राज्यघटना', 'राजव्यवस्था', 'संविधान', 'लक्ष्मीकांत', 'laxmikanth', 'history', 'इतिहास', 'modern history', 'आधुनिक भारत', 'geography', 'भूगोल', 'सह्याद्री', 'economy', 'economics', 'अर्थशास्त्र', 'अर्थव्यवस्था', 'csat', 'maths', 'reasoning', 'aptitude', 'बुद्धिमत्ता', 'अंकगणित', 'गणित', 'current affairs', 'चालू घडामोडी', 'करेंट अफेयर्स', 'editorial', 'science', 'सामान्य विज्ञान', 'विज्ञान', 'environment', 'पर्यावरण'].some(s => cleanMsg.includes(s))) return true;

  // Mode or options check
  if (['sprint', 'balance', 'समतोल', 'संतुलन', 'सराव', 'adjust', 'बदला', 'change hours', 'switch subject', 'working aspirant'].some(w => cleanMsg.includes(w))) return true;

  return false;
}

function buildMetaAiStudyPlanInquiry({ selectedLang = 'en', user = null }) {
  const userName = user?.name ? user.name.split(' ')[0] : '';
  if (selectedLang === 'mr') {
    return {
      text: `🤖 **वैयक्तिक अभ्यास नियोजन (मेटा एआय प्रमाणे)**\n\nनमस्कार ${userName ? `${userName}! ` : ''}कोणताही रेडीमेड किंवा ऑटो-जनरेट केलेला साचा देण्याऐवजी, आपण तुमच्या प्रत्यक्ष गरजेनुसार आणि वेळेनुसार अचूक अभ्यास नियोजन तयार करूया! 🎯\n\n**मी तुम्हाला अभ्यासात कोणती मदत करू?** कृपया खालील माहिती सांगा:\n\n१. 📚 **लक्षित परीक्षा:** UPSC, MPSC राज्यसेवा की MPSC संयुक्त (गट ब/क)?\n२. ⏳ **अभ्यासासाठी उपलब्ध वेळ:** आज तुम्ही किती तास देऊ शकता? (उदा. नोकरी/कॉलेज असल्यास ३-४ तास, किंवा पूर्णवेळ ६ ते ८ तास?)\n३. 📖 **विषय व घटक:** आज कोणते विषय अभ्यासायचे आहेत? (उदा. राज्यघटना, इतिहास, भूगोल, अर्थशास्त्र, CSAT की चालू घडामोडी?)\n४. 🎯 **विशिष्ट उद्दिष्ट:** आजचे तासनिहाय वेळापत्रक हवे आहे, GS + CSAT समतोल हवा आहे, की उजळणी व PYQ सराव?\n\n💬 *तुम्ही थेट लिहून पाठवू शकता (उदा. **"MPSC, ६ तास, राज्यघटना आणि CSAT"**), किंवा खालील पर्यायांवर टॅप करा:*`,
      action: 'open_planner',
      suggestedActionLabel: '📅 प्लॅनर उघडा',
      quickReplies: [
        '📚 MPSC नियोजन (६ तास)',
        '🏛️ UPSC नियोजन (८ तास)',
        '💼 नोकरी + अभ्यास (४ तास)',
        '🎯 GS + CSAT समतोल',
        '🔄 उजळणी व PYQ सराव'
      ]
    };
  }

  if (selectedLang === 'hi') {
    return {
      text: `🤖 **व्यक्तिगत स्टडी प्लान (मेटा AI की तरह)**\n\nनमस्ते ${userName ? `${userName}! ` : ''}किसी ऑटो-जनरेटेड या तयशुदा टाइमटेबल के बजाय, आइए आपकी दिनचर्या, उपलब्ध समय और प्राथमिकताओं के आधार पर एक कस्टमाइज्ड स्टडी प्लान बनाएं! 🎯\n\n**मैं आपकी पढ़ाई में किस प्रकार की सहायता करूँ?** कृपया बताइए:\n\n1. 📚 **लक्षित परीक्षा:** UPSC, MPSC राज्यसेवा या MPSC कम्बाइंड (ग्रुप B/C)?\n2. ⏳ **उपलब्ध अध्ययन समय:** आज आप कितने घंटे पढ़ सकते हैं? (जैसे जॉब/कॉलेज के साथ 3-4 घंटे, या फुल-टाइम 6 से 8 घंटे?)\n3. 📖 **विषय और फोकस:** आज किन विषयों पर ध्यान देना है? (जैसे राजव्यवस्था, इतिहास, भूगोल, CSAT, अर्थव्यवस्था या करेंट अफेयर्स?)\n4. 🎯 **विशिष्ट जरूरत:** पूरे दिन का टाइमटेबल चाहिए, GS + CSAT का संतुलन, या रिवीजन और PYQs का शेड्यूल?\n\n💬 *आप सीधे लिखकर बता सकते हैं (जैसे **"UPSC, 6 घंटे, पॉलिटी और CSAT"**), या नीचे दिए गए त्वरित विकल्पों पर टैप करें:*`,
      action: 'open_planner',
      suggestedActionLabel: '📅 प्लानर खोलें',
      quickReplies: [
        '📚 MPSC प्लान (6 घंटे)',
        '🏛️ UPSC प्लान (8 घंटे)',
        '💼 जॉब + पढ़ाई (4 घंटे)',
        '🎯 GS + CSAT संतुलन',
        '🔄 रिवीजन व PYQ प्लान'
      ]
    };
  }

  return {
    text: `🤖 **Personalized Study Planner (Meta AI Style)**\n\nHello ${userName ? `${userName}! ` : ''}Instead of giving you a generic, auto-generated timetable, let's create a custom study plan tailored specifically to you. 🎯\n\n**What study help should I do for you today?** Please let me know:\n\n1. 📚 **Target Exam:** UPSC Civil Services, MPSC Rajyaseva, or MPSC Combine (Group B/C)?\n2. ⏳ **Available Time:** How many hours can you commit today? (e.g., 3–4 hrs for working/college, 6 hrs, or 8–10 hrs full-time?)\n3. 📖 **Subjects & Focus:** Which subjects do you want to cover? (e.g., Polity, CSAT, Modern History, Geography, Economy, or Current Affairs?)\n4. 🎯 **Specific Goal:** Need a daily hourly timetable, a balanced GS+CSAT routine, a backlog recovery plan, or a revision & PYQ sprint?\n\n💬 *Simply reply with your preferences (for example: **"MPSC, 6 hours, Polity and CSAT"**), or choose one of the quick options below:*`,
    action: 'open_planner',
    suggestedActionLabel: '📅 Open Planner',
    quickReplies: [
      '📚 MPSC Plan (6 Hours)',
      '🏛️ UPSC Plan (8 Hours)',
      '💼 Working Aspirant (4 Hours)',
      '🎯 GS + CSAT Balance',
      '🔄 Revision & PYQ Sprint'
    ]
  };
}

function buildStudentCustomizedPlan({ cleanMsg, selectedLang = 'en', user = null, sessions = [], plans = [] }) {
  // Parse target hours
  let targetHours = 6;
  const hourMatch = cleanMsg.match(/(\d+(?:\.\d+)?)\s*(?:hours?|hrs?|hr|तास|घंटे|घंटा)/i);
  if (hourMatch) {
    targetHours = Math.min(Math.max(parseFloat(hourMatch[1]), 2), 14);
  } else if (cleanMsg.includes('10 hours') || cleanMsg.includes('१० तास') || cleanMsg.includes('10 घंटे')) {
    targetHours = 10;
  } else if (cleanMsg.includes('8 hours') || cleanMsg.includes('८ तास') || cleanMsg.includes('8 घंटे')) {
    targetHours = 8;
  } else if (cleanMsg.includes('6 hours') || cleanMsg.includes('६ तास') || cleanMsg.includes('6 घंटे')) {
    targetHours = 6;
  } else if (cleanMsg.includes('4 hours') || cleanMsg.includes('४ तास') || cleanMsg.includes('4 घंटे')) {
    targetHours = 4;
  } else if (cleanMsg.includes('3 hours') || cleanMsg.includes('३ तास') || cleanMsg.includes('3 घंटे')) {
    targetHours = 3;
  } else if (cleanMsg.includes('working') || cleanMsg.includes('job') || cleanMsg.includes('office') || cleanMsg.includes('नोकरी') || cleanMsg.includes('जॉब') || cleanMsg.includes('कामकाजी')) {
    targetHours = 4;
  } else if (cleanMsg.includes('full time') || cleanMsg.includes('पूर्णवेळ') || cleanMsg.includes('फुल टाइम')) {
    targetHours = 8;
  }

  // Parse target exam
  let targetExam = 'UPSC & MPSC';
  if (cleanMsg.includes('mpsc') || cleanMsg.includes('राज्यसेवा') || cleanMsg.includes('rajyaseva') || cleanMsg.includes('combine') || cleanMsg.includes('संयुक्त') || cleanMsg.includes('गट ब') || cleanMsg.includes('गट क') || cleanMsg.includes('group b')) {
    targetExam = 'MPSC';
  } else if (cleanMsg.includes('upsc') || cleanMsg.includes('ias') || cleanMsg.includes('ips') || cleanMsg.includes('civil services')) {
    targetExam = 'UPSC';
  } else if (selectedLang === 'mr') {
    targetExam = 'MPSC';
  }

  // Parse subjects
  const subjects = [];
  if (cleanMsg.includes('polity') || cleanMsg.includes('constitution') || cleanMsg.includes('राज्यघटना') || cleanMsg.includes('राजव्यवस्था') || cleanMsg.includes('संविधान') || cleanMsg.includes('लक्ष्मीकांत')) {
    subjects.push('polity');
  }
  if (cleanMsg.includes('history') || cleanMsg.includes('इतिहास') || cleanMsg.includes('modern history') || cleanMsg.includes('आधुनिक भारत')) {
    subjects.push('history');
  }
  if (cleanMsg.includes('geography') || cleanMsg.includes('भूगोल') || cleanMsg.includes('सह्याद्री')) {
    subjects.push('geography');
  }
  if (cleanMsg.includes('economy') || cleanMsg.includes('economics') || cleanMsg.includes('अर्थशास्त्र') || cleanMsg.includes('अर्थव्यवस्था')) {
    subjects.push('economy');
  }
  if (cleanMsg.includes('csat') || cleanMsg.includes('maths') || cleanMsg.includes('reasoning') || cleanMsg.includes('aptitude') || cleanMsg.includes('बुद्धिमत्ता') || cleanMsg.includes('अंकगणित') || cleanMsg.includes('गणित')) {
    subjects.push('csat');
  }
  if (cleanMsg.includes('current affairs') || cleanMsg.includes('चालू घडामोडी') || cleanMsg.includes('करेंट अफेयर्स') || cleanMsg.includes('editorial') || cleanMsg.includes('news')) {
    subjects.push('current_affairs');
  }
  if (cleanMsg.includes('science') || cleanMsg.includes('सामान्य विज्ञान') || cleanMsg.includes('विज्ञान')) {
    subjects.push('science');
  }
  if (cleanMsg.includes('environment') || cleanMsg.includes('पर्यावरण')) {
    subjects.push('environment');
  }

  const isWorking = cleanMsg.includes('working') || cleanMsg.includes('job') || cleanMsg.includes('office') || cleanMsg.includes('नोकरी') || cleanMsg.includes('जॉब') || cleanMsg.includes('कामकाजी');

  // Assign primary and secondary subjects
  const subjectLabels = {
    en: {
      polity: 'Indian Polity & Constitution (Laxmikanth & Art. Breakdown)',
      history: 'Modern History & Freedom Struggle (Spectrum / NCERT)',
      geography: targetExam === 'MPSC' ? 'Maharashtra & Physical Geography' : 'Physical & Indian Geography (NCERT & Maps)',
      economy: 'Indian Economy & Budget Concepts',
      csat: 'CSAT: Reading Comprehension & Reasoning Aptitude',
      current_affairs: 'Daily Editorial & Current Affairs Notes',
      science: 'General Science & Tech Developments',
      environment: 'Ecology & Biodiversity Hotspots'
    },
    mr: {
      polity: 'भारतीय राज्यघटना व पंचायत राज (लक्ष्मीकांत / रंजन कोळंबे)',
      history: targetExam === 'MPSC' ? 'आधुनिक भारताचा व महाराष्ट्राचा इतिहास' : 'आधुनिक भारताचा इतिहास',
      geography: targetExam === 'MPSC' ? 'महाराष्ट्राचा व भारताचा भूगोल (नकाशे व प्राकृतिक)' : 'भारताचा व प्राकृतिक भूगोल',
      economy: 'भारतीय अर्थव्यवस्था, पंचवार्षिक योजना व शासकीय योजना',
      csat: 'CSAT: अंकगणित, बुद्धिमत्ता चाचणी व आकलन (Comprehension)',
      current_affairs: 'दैनिक चालू घडामोडी, संपादकीय व महत्त्वाच्या घडामोडी',
      science: 'सामान्य विज्ञान (भौतिक, रसायन व जीवशास्त्र)',
      environment: 'पर्यावरण व जैवविविधता'
    },
    hi: {
      polity: 'भारतीय राजव्यवस्था एवं संविधान (एम. लक्ष्मीकांत)',
      history: 'आधुनिक भारत का इतिहास (स्पेक्ट्रम / विपिन चंद्र)',
      geography: 'भारत एवं भौतिक भूगोल (NCERT व मानचित्र)',
      economy: 'भारतीय अर्थव्यवस्था एवं सरकारी योजनाएं',
      csat: 'CSAT: बौद्धगम्यता (Comprehension), गणित व रीजनिंग',
      current_affairs: 'दैनिक करेंट अफेयर्स एवं संपादकीय विश्लेषण',
      science: 'सामान्य विज्ञान एवं प्रौद्योगिकी',
      environment: 'पर्यावरण एवं पारिस्थितिकी'
    }
  };

  const currentLangLabels = subjectLabels[selectedLang] || subjectLabels.en;
  let primarySub = currentLangLabels[subjects[0]] || currentLangLabels.polity;
  let secondarySub = currentLangLabels[subjects[1]] || (subjects.includes('csat') ? currentLangLabels.history : currentLangLabels.csat);

  let planText = '';

  if (selectedLang === 'mr') {
    if (isWorking || targetHours <= 4) {
      planText = `🎯 **तुमच्या गरजेनुसार सानुकूल अभ्यास नियोजन (${targetHours} तास • ${targetExam})**\n\nनोकरी/कामासोबत अभ्यासाचा ताळमेळ साधण्यासाठी हे विशेष वेळापत्रक तयार केले आहे:\n\n• 🌅 **सत्र १ (सकाळी ०६:०० ते ०७:४५ | १.७५ तास) • मुख्य अभ्यास:**\n  📖 **${primarySub}:** सकाळी मन ताजेतवाने असताना अवघड विषय व मूलभूत संकल्पना पूर्ण करा.\n\n• 🥪 **मायक्रो-सेशन (दुपारी ०१:०० ते ०१:४५ | ४५ मिनिटे) • लंच / प्रवास वेळ:**\n  📰 **चालू घडामोडी:** मोबाईलवर चालू घडामोडींचे मुद्दे किंवा संपादकीय विश्लेषण वाचा.\n\n• 🌆 **सत्र २ (रात्री ०८:३० ते १०:०० | १.५ तास) • प्रॅक्टिस ब्लॉक:**\n  🔢 **${secondarySub}:** रात्री प्रश्न सोडवणे किंवा २५-३० MCQs चा वेळेत सराव करा.\n\n• 🌙 **दिवसाचा शेवट (रात्री १०:१५ ते १०:३० | १५ मिनिटे):**\n  🔁 **अॅक्टिव्ह रिकॉल:** आज वाचलेल्या महत्त्वाच्या ३ मुद्द्यांची वही बंद करून उजळणी करा.`;
    } else if (targetHours >= 8) {
      planText = `🎯 **तुमच्या गरजेनुसार सानुकूल अभ्यास नियोजन (${targetHours} तास • ${targetExam} पूर्णवेळ)**\n\nतुमच्या वेळेनुसार आणि विषयानुसार तयार केलेले हे उच्च-उत्पादक वेळापत्रक:\n\n• 🌅 **सत्र १ (सकाळी ०७:३० ते १०:३० | ३ तास) • डीप वर्क:**\n  📖 **${primarySub}:** दिवसातील सर्वोच्च एकाग्रतेचा वेळ. संदर्भ पुस्तकांचे सखोल वाचन.\n\n• ☕ *१५ मिनिटे ब्रेक (पाणी प्या, डोळ्यांना विश्रांती द्या)*\n\n• ☀️ **सत्र २ (सकाळी ११:०० ते दुपारी ०१:०० | २ तास) • अॅक्टिव्ह प्रॅक्टिस:**\n  🔢 **${secondarySub}:** CSAT बुद्धिमत्ता, गणित किंवा मागील वर्षांचे प्रश्न (PYQs).\n\n• 🍽️ *दुपारचे जेवण व विश्रांती*\n\n• 🌆 **सत्र ३ (दुपारी ०३:३० ते ०५:३० | २ तास) • सप्लीमेंटरी जीएस:**\n  📚 **${subjects[2] ? currentLangLabels[subjects[2]] : currentLangLabels.geography}:** संकल्पनांचे रिव्हिजन व संक्षिप्त नोट्स तयार करणे.\n\n• 🌙 **सत्र ४ (रात्री ०८:३० ते ०९:३० | १ तास) • चालू घडामोडी व रिकॉल:**\n  📰 दैनिक चालू घडामोडी नोट्स + १५ मिनिटांत आज वाचलेल्याचे रिकॉल!`;
    } else {
      planText = `🎯 **तुमच्या गरजेनुसार सानुकूल अभ्यास नियोजन (${targetHours} तास • ${targetExam})**\n\nतुमच्या दिलेल्या वेळेनुसार हे संतुलित ६ तासांचे वेळापत्रक:\n\n• 🌅 **सत्र १ (सकाळी ०८:०० ते १०:३० | २.५ तास) • मूलभूत विषय:**\n  📖 **${primarySub}:** एकाग्रतेने मुख्य टॉपिक वाचा आणि महत्त्वाच्या कलमांची नोंद ठेवा.\n\n• ☕ *१५ मिनिटांचा पोमोडोरो ब्रेक*\n\n• ☀️ **सत्र २ (सकाळी ११:०० ते दुपारी ०१:०० | २ तास) • विश्लेषणात्मक प्रॅक्टिस:**\n  🔢 **${secondarySub}:** CSAT समस्या सोडवणे किंवा ३० टाइमर-आधारित MCQs चा सराव.\n\n• 🍽️ *दुपारचे जेवण व विश्रांती*\n\n• 🌆 **सत्र ३ (संध्याकाळी ०४:३० ते ०५:३० | १ तास) • चालू घडामोडी:**\n  📰 दैनिक चालू घडामोडी, शासकीय योजना व संपादकीय मुद्दे.\n\n• 🌙 **सत्र ४ (रात्री ०९:०० ते ०९:३० | ३० मिनिटे) • जलद उजळणी:**\n  🔁 **अॅक्टिव्ह रिकॉल व PYQs:** आजच्या नोट्सची १० मिनिटांत नजरेखालून घालणे व १० PYQs सोडवणे.`;
    }

    planText += `\n\n---\n💡 *मेटा एआय टीप: घड्याळाच्या वेळेचे बंधन पाळण्याची सक्ती नाही—तुमच्या स्वतःच्या सोयीनुसार आणि ऊर्जेनुसार हे स्लॉट्स पुढे-मागे करू शकता!*\n\n❓ **हा अभ्यास प्लॅन तुमच्या वेळापत्रकास योग्य वाटतो का?**\nतुम्हाला यात वेळ वाढवायची/कमी करायची आहे, विषय बदलायचे आहेत की ब्रेकचा वेळ वाढवायचा आहे?`;

    return {
      text: planText,
      action: 'open_planner',
      suggestedActionLabel: '📅 प्लॅनरमध्ये नोंदवा',
      quickReplies: [
        '📅 प्लॅनर उघडा',
        '▶ टायमर सुरू करा',
        '🔄 ४ तास करा',
        '📚 विषय बदला'
      ]
    };
  }

  if (selectedLang === 'hi') {
    if (isWorking || targetHours <= 4) {
      planText = `🎯 **आपकी जरूरत अनुसार कस्टम स्टडी प्लान (${targetHours} घंटे • ${targetExam})**\n\nजॉब/कॉलेज के साथ पढ़ाई में संतुलन बनाए रखने के लिए यह कस्टमाइज्ड शेड्यूल:\n\n• 🌅 **स्लॉट 1 (सुबह 06:00 से 07:45 | 1.75 घंटे) • डीप फोकस:**\n  📖 **${primarySub}:** सुबह शांत वातावरण में कठिन विषय और मुख्य कॉन्सेप्ट्स तैयार करें.\n\n• 🥪 **माइक्रो-सेशन (दोपहर 01:00 से 01:45 | 45 मिनट) • लंच/ट्रैवल टाइम:**\n  📰 **करेंट अफेयर्स:** मोबाइल पर डेली न्यूज़ समरी व संपादकीय विश्लेषण पढ़ें.\n\n• 🌆 **स्लॉट 2 (रात 08:30 से 10:00 | 1.5 घंटे) • एक्टिव प्रैक्टिस:**\n  🔢 **${secondarySub}:** CSAT सवाल हल करना या 25 टाइमर-आधारित MCQs की प्रैक्टिस.\n\n• 🌙 **दिन की समाप्ति (रात 10:15 से 10:30 | 15 मिनट):**\n  🔁 **एक्टिव रिकॉल:** किताब बंद करके आज सीखे गए 3 मुख्य बिंदुओं को याद करें.`;
    } else if (targetHours >= 8) {
      planText = `🎯 **आपकी जरूरत अनुसार कस्टम स्टडी प्लान (${targetHours} घंटे • ${targetExam} फुल-टाइम)**\n\nआपके इनपुट के अनुसार तैयार किया गया संतुलित और प्रभावी टाइमटेबल:\n\n• 🌅 **स्लॉट 1 (सुबह 07:30 से 10:30 | 3 घंटे) • कोर जीएस:**\n  📖 **${primarySub}:** दिन का सबसे ऊर्जावान समय। मुख्य मानक पुस्तकों का गहरा अध्ययन.\n\n• ☕ *15 मिनट का ब्रेक (पानी पिएं, आंखों को आराम दें)*\n\n• ☀️ **स्लॉट 2 (सुबह 11:00 से 01:00 | 2 घंटे) • प्रॉब्लम सॉल्विंग:**\n  🔢 **${secondarySub}:** CSAT रीजनिंग, मैथ्स या पिछले वर्षों के प्रश्न (PYQs).\n\n• 🍽️ *दोपहर का भोजन व विश्राम*\n\n• 🌆 **स्लॉट 3 (दोपहर 03:30 से 05:30 | 2 घंटे) • सेकेंडरी जीएस:**\n  📚 **${subjects[2] ? currentLangLabels[subjects[2]] : currentLangLabels.geography}:** महत्वपूर्ण विषयों का रिवीजन व शॉर्ट नोट्स.\n\n• 🌙 **स्लॉट 4 (रात 08:30 से 09:30 | 1 घंटा) • करेंट अफेयर्स व रिकॉल:**\n  📰 दैनिक करेंट अफेयर्स + 15 मिनट में आज पढ़े गए नोट्स की त्वरित समीक्षा!`;
    } else {
      planText = `🎯 **आपकी जरूरत अनुसार कस्टम स्टडी प्लान (${targetHours} घंटे • ${targetExam})**\n\nआपके समय के अनुसार तैयार किया गया 6 घंटे का आदर्श शेड्यूल:\n\n• 🌅 **स्लॉट 1 (सुबह 08:00 से 10:30 | 2.5 घंटे) • कोर कॉन्सेप्ट्स:**\n  📖 **${primarySub}:** ध्यान से मुख्य चैप्टर पढ़ें और महत्वपूर्ण अनुच्छेदों/तथ्यों को नोट करें.\n\n• ☕ *15 मिनट का पोमोडोरो ब्रेक*\n\n• ☀️ **स्लॉट 2 (सुबह 11:00 से 01:00 | 2 घंटे) • एनालिटिकल प्रैक्टिस:**\n  🔢 **${secondarySub}:** CSAT अभ्यास या 30 टाइमर-आधारित मॉक प्रश्न.\n\n• 🍽️ *दोपहर का भोजन व विश्राम*\n\n• 🌆 **स्लॉट 3 (शाम 04:30 से 05:30 | 1 घंटा) • करेंट अफेयर्स:**\n  📰 दैनिक समाचार विश्लेषण, सरकारी योजनाएं व मुख्य संपादकीय.\n\n• 🌙 **स्लॉट 4 (रात 09:00 से 09:30 | 30 मिनट) • त्वरित रिवीजन:**\n  🔁 **एक्टिव रिकॉल व PYQs:** आज के नोट्स की 10 मिनट में समीक्षा और 10 पिछले वर्षों के प्रश्न हल करें.`;
    }

    planText += `\n\n---\n💡 *मेटा AI टिप: यह समय पूरी तरह लचीला है—अपनी व्यक्तिगत ऊर्जा और दिनचर्या के अनुसार स्लॉट्स बदल सकते हैं!*\n\n❓ **क्या यह प्लान आपकी दिनचर्या के अनुकूल लग रहा है?**\nक्या आप समय बदलना चाहते हैं, विषय बदलना चाहते हैं, या कोई अतिरिक्त ब्रेक जोड़ना चाहते हैं?`;

    return {
      text: planText,
      action: 'open_planner',
      suggestedActionLabel: '📅 प्लानर में जोड़ें',
      quickReplies: [
        '📅 प्लानर खोलें',
        '▶ टाइमर शुरू करें',
        '🔄 4 घंटे करें',
        '📚 विषय बदलें'
      ]
    };
  }

  // English
  if (isWorking || targetHours <= 4) {
    planText = `🎯 **Customized Study Plan for You (${targetHours} Hours • ${targetExam})**\n\nDesigned specifically for a working / busy aspirant schedule:\n\n• 🌅 **Slot 1 (06:00 AM – 07:45 AM | 1.75 Hours) • Early Deep Focus:**\n  📖 **${primarySub}:** Peak morning alertness before office/classes. Read core textbook chapters and highlight essential points.\n\n• 🥪 **Midday Micro-Session (01:00 PM – 01:45 PM | 45 Mins) • Lunch / Commute:**\n  📰 **Daily Editorial & Current Affairs:** Read daily news analysis or review digital flashcards on your phone.\n\n• 🌆 **Slot 2 (08:30 PM – 10:00 PM | 1.5 Hours) • Evening Practice:**\n  🔢 **${secondarySub}:** Active problem-solving, CSAT quantitative reasoning, or 25 timed MCQs.\n\n• 🌙 **Night Wrap-Up (10:15 PM – 10:30 PM | 15 Mins):**\n  🔁 **Active Recall:** Close books and mentally summarize today's 3 key takeaways.`;
  } else if (targetHours >= 8) {
    planText = `🎯 **Customized Study Plan for You (${targetHours} Hours • ${targetExam} Full-Time)**\n\nTailored specifically to your available hours and target subjects:\n\n• 🌅 **Slot 1 (07:30 AM – 10:30 AM | 3.0 Hours) • Deep Core Focus:**\n  📖 **${primarySub}:** Peak focus window. Study core standard textbooks and make crisp topic summaries.\n\n• ☕ *15-min break (Hydrate, stretch, rest eyes)*\n\n• ☀️ **Slot 2 (11:00 AM – 01:00 PM | 2.0 Hours) • Analytical Practice:**\n  🔢 **${secondarySub}:** Active CSAT practice, numerical problems, or solving Previous Year Questions (PYQs).\n\n• 🍽️ *Lunch & Power Nap*\n\n• 🌆 **Slot 3 (03:30 PM – 05:30 PM | 2.0 Hours) • Secondary Subject:**\n  📚 **${subjects[2] ? currentLangLabels[subjects[2]] : currentLangLabels.geography}:** Syllabus topic coverage with maps, diagrams, and revision.\n\n• 🌙 **Slot 4 (08:30 PM – 09:30 PM | 1.0 Hour) • Current Affairs & Recap:**\n  📰 Daily news notes + 15 mins quick recap of morning notes and 15 PYQs.`;
  } else {
    planText = `🎯 **Customized Study Plan for You (${targetHours} Hours • ${targetExam})**\n\nTailored specifically to your available time and focus subjects:\n\n• 🌅 **Slot 1 (08:00 AM – 10:30 AM | 2.5 Hours) • Deep Concept Study:**\n  📖 **${primarySub}:** Study standard reference material with zero phone distractions.\n\n• ☕ *15-minute Pomodoro Break*\n\n• ☀️ **Slot 2 (11:00 AM – 01:00 PM | 2.0 Hours) • Active Problem-Solving:**\n  🔢 **${secondarySub}:** Solve CSAT reasoning problems or 30 timed MCQs.\n\n• 🍽️ *Midday Lunch & Relaxation*\n\n• 🌆 **Slot 3 (04:30 PM – 05:30 PM | 1.0 Hour) • Daily Awareness:**\n  📰 Daily Editorial, government schemes, and monthly current affairs compilation.\n\n• 🌙 **Slot 4 (09:00 PM – 09:30 PM | 30 Mins) • Active Recall & PYQs:**\n  🔁 **Spaced Recap:** 15 mins recalling key notes from Slot 1 + 10 Previous Year Questions.`;
  }

  planText += `\n\n---\n💡 *Meta AI Tip: You don't have to follow rigid clock times—shift these blocks to align with your personal energy peaks!*\n\n❓ **How does this study plan feel for your schedule?**\nWould you like me to adjust the hours, change any subjects, or schedule extra break intervals?`;

  return {
    text: planText,
    action: 'open_planner',
    suggestedActionLabel: '📅 Save to Study Planner',
    quickReplies: [
      '📅 Open Study Planner',
      '▶ Start Focus Timer',
      '🔄 Adjust to 4 Hours',
      '📚 Switch Subjects'
    ]
  };
}

// -------------------------------------------------------------
// Interactive 3-Tier Subject & Topic Revision System (UPSC & MPSC)
// -------------------------------------------------------------
const REVISION_SUBJECTS = {
  polity: {
    id: 'polity',
    title: {
      en: '📖 Indian Polity',
      mr: '📖 भारतीय राज्यघटना',
      hi: '📖 भारतीय राजव्यवस्था'
    },
    intro: {
      en: '📖 **Indian Polity & Constitution Revision**\n\nChoose a high-yield topic below to revise active recall summaries, landmark judgments, and key Articles:',
      mr: '📖 **भारतीय राज्यघटना उजळणी (Polity Revision)**\n\nमहत्त्वाची कलमे, घटनादुरुस्त्या आणि परीक्षाभिमुख मुद्दे उजळणी करण्यासाठी खालील घटकावर टॅप करा:',
      hi: '📖 **भारतीय राजव्यवस्था एवं संविधान रिवीजन**\n\nमहत्वपूर्ण अनुच्छेद, संशोधन और परीक्षा-उपयोगी तथ्यों का रिवीजन करने के लिए नीचे दिए गए टॉपिक पर टैप करें:'
    },
    topics: [
      {
        id: 'fr',
        label: {
          en: '🏛️ Fundamental Rights (Art 12–35)',
          mr: '🏛️ मूलभूत हक्क (कलम १२-३५)',
          hi: '🏛️ मौलिक अधिकार (अनु. 12-35)'
        },
        card: {
          en: `🏛️ **Active Recall: Fundamental Rights (Part III, Art 12–35)**\n\n🎯 **Core Exam Essentials:**\n• **Justiciable & Protected:** Enforceable directly via Supreme Court (Art 32) and High Court (Art 226).\n• **Art 14–18 (Equality):** Rule of Law (Art 14), Abolition of Untouchability (Art 17 - absolute), Abolition of Titles (Art 18).\n• **Art 19 (6 Freedoms):** Speech, assembly, association, movement, residence, profession (subject to reasonable restrictions).\n• **Art 21 (Life & Personal Liberty):** Expanded via *Maneka Gandhi Case (1978)* to include right to privacy, clean environment, speedy trial.\n• **Art 21A:** Right to free & compulsory education (6-14 yrs, 86th Amendment 2002).\n• **Art 32 (5 Writs):** Habeas Corpus, Mandamus, Prohibition, Certiorari, Quo-Warranto.\n\n🧠 **Active Recall Challenge (Test your memory before reading!):**\n1. Which two Fundamental Rights can NEVER be suspended, even during a National Emergency under Art 352? *(Answer: Articles 20 and 21 - 44th Amendment 1978)*\n2. Which writ is issued against unlawful detention of a person? *(Answer: Habeas Corpus)*\n3. Are Fundamental Rights available against private individuals? *(Answer: Art 17, 23, 24 apply against both State and private individuals)*\n\n⚠️ **Prelims Trap:** Fundamental Rights are NOT absolute. They are qualified and subject to reasonable restrictions (except Art 17 & 24). Parliament can curtail them via Constitutional Amendment without violating Basic Structure.`,
          mr: `🏛️ **अॅक्टिव्ह रिकॉल: मूलभूत हक्क (भाग ३, कलमे १२ ते ३५)**\n\n🎯 **परीक्षेसाठी महत्त्वाचे मुद्दे:**\n• **न्यायप्रविष्ट स्वरूप:** हक्कांचे उल्लंघन झाल्यास थेट सर्वोच्च न्यायालयात (कलम ३२) व उच्च न्यायालयात (कलम २२६) दाद मागता येते.\n• **कलम १४-१८ (समता):** कायद्यापुढे समानता (कलम १४), अस्पृश्यता निवारण (कलम १७ - पूर्ण हक्क), पदव्यांची समाप्ती (कलम १८).\n• **कलम १९ (६ स्वातंत्र्ये):** भाषण, शांततापूर्ण सभा, संघटना, संचार, वास्तव्य व व्यवसाय स्वातंत्र्य.\n• **कलम २१ (व्यक्तिगत स्वातंत्र्य):** मेनका गांधी खटल्याने (१९७८) यात गोपनीयतेचा हक्क, स्वच्छ पर्यावरणाचा हक्क समाविष्ट केला.\n• **कलम २१A:** शिक्षणाचा मूलभूत हक्क (८६ वी घटनादुरुस्ती २००२).\n• **कलम ३२ (५ प्राधिलेख):** बंदी प्रत्यक्षीकरण, परमादेश, प्रतिषेध, उत्प्रेषण, अधिकार पृच्छा.\n\n🧠 **अॅक्टिव्ह रिकॉल आव्हान (पुस्तक न पाहता आठवा!):**\n१. राष्ट्रीय आणीबाणीत (कलम ३५२) कोणती दोन कलमे कधीही निलंबित होत नाहीत? *(उत्तर: कलम २० आणि २१ - ४४ वी घटनादुरुस्ती)*\n२. बेकायदेशीर अटकेविरुद्ध कोणता प्राधिलेख काढला जातो? *(उत्तर: बंदी प्रत्यक्षीकरण / Habeas Corpus)*\n३. डॉ. आंबेडकरांनी कोणत्या कलमाला 'घटनेचा आत्मा' म्हटले? *(उत्तर: कलम ३२)*\n\n⚠️ **प्रिलिम्स अलर्ट:** मूलभूत हक्क निरपेक्ष (absolute) नाहीत. त्यावर वाजवी बंधने घालता येतात (कलम १७ आणि २४ वगळता).`,
          hi: `🏛️ **एक्टिव रिकॉल: मौलिक अधिकार (भाग III, अनुच्छेद 12–35)**\n\n🎯 **मुख्य परीक्षा तथ्य:**\n• **न्यायोचित (Justiciable):** उल्लंघन होने पर सीधे सुप्रीम कोर्ट (अनुच्छेद 32) या हाई कोर्ट (अनुच्छेद 226) जाया जा सकता है.\n• **अनुच्छेद 14-18 (समानता):** विधि के समक्ष समानता (14), अस्पृश्यता का अंत (17 - आत्यंतिक), उपाधियों का अंत (18).\n• **अनुच्छेद 19 (6 स्वतंत्रताएं):** वाक्-अभिव्यक्ति, शांतिपूर्ण सम्मेलन, संघ, संचरण, निवास और व्यापार.\n• **अनुच्छेद 21 (प्राण एवं दैहिक स्वतंत्रता):** मेनका गांधी केस (1978) द्वारा गरिमापूर्ण जीवन, निजता का अधिकार (Right to Privacy) शामिल.\n• **अनुच्छेद 21A:** शिक्षा का अधिकार (86वां संविधान संशोधन 2002).\n• **अनुच्छेद 32 (5 रिट):** बंदी प्रत्यक्षीकरण, परमादेश, प्रतिषेध, उत्प्रेषण, अधिकार-पृच्छा.\n\n🧠 **एक्टिव रिकॉल चुनौती (याद करने का प्रयास करें!):**\n1. राष्ट्रीय आपातकाल में कौन से दो अनुच्छेद कभी निलंबित नहीं होते? *(उत्तर: अनुच्छेद 20 और 21)*\n2. डॉ. अम्बेडकर ने किस अनुच्छेद को 'संविधान का हृदय व आत्मा' कहा? *(उत्तर: अनुच्छेद 32)*\n\n⚠️ **प्रीलिम्स ट्रैप:** मौलिक अधिकार असीमित (Absolute) नहीं हैं; उन पर युक्तिसंगत प्रतिबंध लगाए जा सकते हैं.`
        }
      },
      {
        id: 'dpsp',
        label: {
          en: '📜 Directive Principles & Duties (Part IV & IVA)',
          mr: '📜 मार्गदर्शक तत्त्वे व कर्तव्ये (भाग ४ व ४A)',
          hi: '📜 नीति निदेशक तत्व व कर्तव्य (भाग IV व IVA)'
        },
        card: {
          en: `📜 **Active Recall: DPSPs (Part IV) & Fundamental Duties (Part IVA)**\n\n🎯 **Core Exam Essentials:**\n• **Source:** DPSPs borrowed from Ireland (Spanish origin); Fundamental Duties from USSR.\n• **Nature of DPSP (Art 36–51):** Non-justiciable, yet fundamental in the governance of the country (Art 37).\n• **Key DPSP Articles:**\n  - Art 39A: Equal justice and free legal aid (42nd Amend).\n  - Art 40: Organization of Village Panchayats.\n  - Art 44: Uniform Civil Code (UCC).\n  - Art 45: Early childhood care and education below age 6.\n  - Art 50: Separation of Judiciary from Executive.\n  - Art 51: Promotion of international peace and security.\n• **Fundamental Duties (Art 51A):** Added by 42nd Amend (1976) on Swaran Singh Committee recommendation (originally 10, 11th added by 86th Amend in 2002).\n\n🧠 **Active Recall Challenge:**\n1. Which case established the "harmonious balance" between Fundamental Rights and DPSPs? *(Answer: Minerva Mills Case, 1980)*\n2. Are Fundamental Duties enforceable by courts directly? *(Answer: Non-enforceable, but Parliament can legislate penalties)*`,
          mr: `📜 **अॅक्टिव्ह रिकॉल: मार्गदर्शक तत्त्वे (भाग ४) आणि मूलभूत कर्तव्ये (भाग ४A)**\n\n🎯 **परीक्षेसाठी महत्त्वाचे मुद्दे:**\n• **स्रोत:** मार्गदर्शक तत्त्वे आयर्लंडकडून; मूलभूत कर्तव्ये रशियाकडून (USSR).\n• **स्वरूप:** मार्गदर्शक तत्त्वे बिगर-न्यायप्रविष्ट आहेत, मात्र देशाच्या प्रशासनात मूलभूत आहेत (कलम ३७).\n• **महत्त्वाची कलमे:**\n  - कलम ३९A: समान न्याय व मोफत कायदेशीर सहाय्य.\n  - कलम ४०: ग्रामपंचायतींचे संघटन.\n  - कलम ४४: समान नागरी कायदा (UCC).\n  - कलम ५०: न्यायव्यवस्था कार्यकारिणीपासून वेगळी ठेवणे.\n  - कलम ५१: आंतरराष्ट्रीय शांतता व सुरक्षा.\n• **मूलभूत कर्तव्ये (कलम ५१A):** स्वर्णसिंग समितीच्या शिफारशीनुसार ४२ व्या घटनादुरुस्तीने (१९७६) १० कर्तव्ये जोडली; ११ वे कर्तव्य ८६ व्या दुरुस्तीने (२००२) जोडले.\n\n🧠 **अॅक्टिव्ह रिकॉल आव्हान:**\n१. मूलभूत हक्क आणि मार्गदर्शक तत्त्वे यांच्यातील संतुलनाला राज्यघटनेचा पाया कोणी म्हटले? *(उत्तर: मिनर्व्हा मिल्स खटला १९८०)*`,
          hi: `📜 **एक्टिव रिकॉल: नीति निदेशक तत्व (भाग IV) एवं मूल कर्तव्य (भाग IVA)**\n\n🎯 **मुख्य परीक्षा तथ्य:**\n• **स्रोत:** DPSP आयरलैंड से; मूल कर्तव्य पूर्व सोवियत संघ (USSR) से प्रेरित.\n• **स्वरूप:** DPSP गैर-न्यायसंगत हैं, किंतु शासन के लिए मूलभूत हैं (अनुच्छेद 37).\n• **प्रमुख अनुच्छेद:**\n  - अनु. 39A: समान न्याय और निःशुल्क विधिक सहायता.\n  - अनु. 40: ग्राम पंचायतों का संगठन.\n  - अनु. 44: समान नागरिक संहिता (UCC).\n  - अनु. 50: कार्यपालिका से न्यायपालिका का पृथक्करण.\n• **मूल कर्तव्य (अनु. 51A):** स्वर्ण सिंह समिति की सिफारिश पर 42वें संशोधन (1976) द्वारा शामिल; कुल 11 कर्तव्य (11वां 86वें संशोधन 2002 से).`
        }
      },
      {
        id: 'parliament',
        label: {
          en: '🏛️ Parliament & Legislative Process',
          mr: '🏛️ संसद व कायदे प्रक्रिया',
          hi: '🏛️ संसद एवं विधायी प्रक्रिया'
        },
        card: {
          en: `🏛️ **Active Recall: Parliament & Law Making (Articles 79–122)**\n\n🎯 **Core Exam Essentials:**\n• **Composition:** President + Lok Sabha + Rajya Sabha = Parliament (Art 79).\n• **Rajya Sabha:** Permanent house, 1/3rd members retire every 2 years; max strength 250 (12 nominated by President).\n• **Money Bill (Art 110):** Introduced ONLY in Lok Sabha with President's recommendation. Speaker has final authority. Rajya Sabha can only delay for 14 days.\n• **Joint Sitting (Art 108):** Summons by President, Presided by Lok Sabha Speaker. NOT available for Money Bills or Constitutional Amendment Bills!\n• **Ordinance Power (Art 123):** Promulgated when Parliament is in recess; must be approved within 6 weeks of reassembly.\n\n🧠 **Active Recall Challenge:**\n1. Who decides whether a bill is a Money Bill or not? *(Answer: Speaker of Lok Sabha - decision cannot be questioned)*\n2. Can a Constitutional Amendment Bill be passed in a Joint Sitting? *(Answer: No, both Houses must pass separately)*`,
          mr: `🏛️ **अॅक्टिव्ह रिकॉल: भारतीय संसद आणि कायदे प्रक्रिया (कलम ७९-१२२)**\n\n🎯 **परीक्षेसाठी महत्त्वाचे मुद्दे:**\n• **संसदेची रचना:** राष्ट्रपती + राज्यसभा + लोकसभा (कलम ७९).\n• **राज्यसभा:** स्थायी सभागृह, दर २ वर्षांनी १/३ सदस्य निवृत्त होतात; कमाल संख्या २५० (१२ नामनिर्देशित).\n• **धनविधेयक (कलम ११०):** फक्त लोकसभेत राष्ट्रपतींच्या पूर्वपरवानगीने मांडता येते. सभापतींचा निर्णय अंतिम. राज्यसभेला १४ दिवसांची मुदत.\n• **संयुक्त बैठक (कलम १०८):** राष्ट्रपती बोलवतात, अध्यक्षस्थान लोकसभा सभापती भूषवतात. धनविधेयक व घटनादुरुस्ती विधेयकासाठी संयुक्त बैठक नसते!\n• **अध्यादेश (कलम १२३):** संसदेचे अधिवेशन सुरू नसताना राष्ट्रपती अध्यादेश काढतात; ६ आठवड्यांत मंजुरी आवश्यक.\n\n🧠 **अॅक्टिव्ह रिकॉल आव्हान:**\n१. एखादे विधेयक धनविधेयक आहे की नाही हे कोण ठरवते? *(उत्तर: लोकसभा सभापती)*`,
          hi: `🏛️ **एक्टिव रिकॉल: संसद एवं विधायी प्रक्रिया (अनुच्छेद 79–122)**\n\n🎯 **मुख्य परीक्षा तथ्य:**\n• **संसद का गठन:** राष्ट्रपति + लोकसभा + राज्यसभा = संसद (अनुच्छेद 79).\n• **धन विधेयक (अनुच्छेद 110):** केवल लोकसभा में राष्ट्रपति की पूर्व-अनुमति से; स्पीकर का निर्णय अंतिम; राज्यसभा अधिकतम 14 दिन रोक सकती है.\n• **संयुक्त बैठक (अनुच्छेद 108):** राष्ट्रपति द्वारा आहुत, लोकसभा स्पीकर द्वारा अध्यक्षता. धन विधेयक और संविधान संशोधन में संयुक्त बैठक का प्रावधान नहीं है!\n• **अध्यादेश (अनुच्छेद 123):** संसद के विश्रांतिकाल में राष्ट्रपति द्वारा जारी; पुनः बैठक के 6 सप्ताह में अनुमोदन अनिवार्य.`
        }
      },
      {
        id: 'judiciary',
        label: {
          en: '⚖️ Supreme Court & Judicial Review',
          mr: '⚖️ सर्वोच्च न्यायालय व न्यायालयीन पुनर्विलोकन',
          hi: '⚖️ सुप्रीम कोर्ट व न्यायिक समीक्षा'
        },
        card: {
          en: `⚖️ **Active Recall: Supreme Court & Judicial Review (Articles 124–147)**\n\n🎯 **Core Exam Essentials:**\n• **Appointment:** Collegium system (CJ + 4 senior-most judges of SC).\n• **Original Jurisdiction (Art 131):** Center-State and Inter-State disputes exclusively.\n• **Writ Jurisdiction (Art 32):** Supreme Court cannot refuse a writ petition for Fundamental Rights (unlike High Court under Art 226 which is discretionary).\n• **Court of Record (Art 129):** Judgments have evidentiary value and power to punish for contempt of itself.\n• **Advisory Jurisdiction (Art 143):** President can consult SC on matters of public importance (advice not binding).\n• **Basic Structure Doctrine:** Originates from *Kesavananda Bharati (1973)* - judicial review itself is part of basic structure (*Indira Gandhi v. Raj Narain, 1975*).\n\n🧠 **Active Recall Challenge:**\n1. Is the High Court's writ jurisdiction under Art 226 wider or narrower than SC's Art 32? *(Answer: Wider, as HC can issue writs for legal rights too)*`,
          mr: `⚖️ **अॅक्टिव्ह रिकॉल: सर्वोच्च न्यायालय आणि न्यायालयीन पुनर्विलोकन (कलम १२४-१४७)**\n\n🎯 **परीक्षेसाठी महत्त्वाचे मुद्दे:**\n• **न्यायाधीशांची नियुक्ती:** कॉलेजियम पद्धत (सरन्यायाधीश + ४ ज्येष्ठतम न्यायाधीश).\n• **मूळ अधिकारक्षेत्र (कलम १३१):** केंद्र-राज्य किंवा दोन राज्यांमधील वाद.\n• **प्राधिलेख अधिकारक्षेत्र (कलम ३२):** मूलभूत हक्कांच्या संरक्षणासाठी सर्वोच्च न्यायालयात दाद.\n• **अभिलेख न्यायालय (कलम १२९):** निर्णयांना कायदेशीर पुरावा मूल्य व न्यायालयाचा अवमान शिक्षेचा अधिकार.\n• **सल्लागार अधिकारक्षेत्र (कलम १४३):** राष्ट्रपती सार्वजनिक महत्त्वाच्या विषयांवर सर्वोच्च न्यायालयाचा सल्ला घेऊ शकतात.\n• **मूलभूत चौकट सिद्धांत (Basic Structure):** केशवानंद भारती खटला (१९७३).`,
          hi: `⚖️ **एक्टिव रिकॉल: सुप्रीम कोर्ट एवं न्यायिक समीक्षा (अनुच्छेद 124–147)**\n\n🎯 **मुख्य परीक्षा तथ्य:**\n• **आरंभिक क्षेत्राधिकार (अनुच्छेद 131):** केंद्र-राज्य और राज्यों के आपसी विवाद.\n• **अभिलेख न्यायालय (अनुच्छेद 129):** अपनी अवमानना के लिए दंड देने की शक्ति.\n• **परामर्शदात्री क्षेत्राधिकार (अनुच्छेद 143):** राष्ट्रपति कानूनी विषय पर सुप्रीम कोर्ट से राय मांग सकते हैं.\n• **मूल संरचना सिद्धांत:** केशवानंद भारती केस (1973) द्वारा स्थापित.`
        }
      },
      {
        id: 'emergency',
        label: {
          en: '⚡ Emergency Provisions (Art 352–360)',
          mr: '⚡ आणीबाणी तरतुदी (कलम ३५२-३६०)',
          hi: '⚡ आपातकालीन प्रावधान (अनु. 352-360)'
        },
        card: {
          en: `⚡ **Active Recall: Emergency Provisions (Part XVIII, Articles 352–360)**\n\n🎯 **Core Exam Essentials:**\n• **National Emergency (Art 352):** Grounds: War, External Aggression, or Armed Rebellion (44th Amend replaced 'internal disturbance'). Requires written advice from Cabinet. Must be approved within 1 month by Special Majority in both Houses.\n• **President's Rule / State Emergency (Art 356 & 365):** Breakdown of constitutional machinery in a State. Needs Simple Majority within 2 months. Max duration: 3 years (*S.R. Bommai case 1994* made it subject to judicial review).\n• **Financial Emergency (Art 360):** Threat to financial stability or credit of India. Never declared so far!\n\n🧠 **Active Recall Challenge:**\n1. What majority is needed to approve a National Emergency? *(Answer: Special Majority - majority of total membership and 2/3rd present and voting)*\n2. Has Financial Emergency (Art 360) ever been invoked in India? *(Answer: No, never)*`,
          mr: `⚡ **अॅक्टिव्ह रिकॉल: आणीबाणी तरतुदी (भाग १८, कलमे ३५२ ते ३६०)**\n\n🎯 **परीक्षेसाठी महत्त्वाचे मुद्दे:**\n• **राष्ट्रीय आणीबाणी (कलम ३५२):** कारणे: युद्ध, परकीय आक्रमण, किंवा सशस्त्र उठाव (४४ व्या दुरुस्तीने 'अंतर्गत अशांतता' शब्द बदलला). मंत्रिमंडळाची लेखी शिफारस आवश्यक. १ महिन्यात विशेष बहुमताने मंजुरी आवश्यक.\n• **राष्ट्रपती राजवट (कलम ३५६):** राज्यातील घटनात्मक यंत्रणा कोसळल्यास. २ महिन्यांत साध्या बहुमताने मंजुरी. जास्तीत जास्त ३ वर्षे (*एस. आर. बोम्मई खटला १९९४ - न्यायालयीन पुनर्विलोकन शक्य*).\n• **आर्थिक आणीबाणी (कलम ३६०):** भारताची आर्थिक स्थिरता धोक्यात आल्यास. आजपर्यंत एकदाही लागू झालेली नाही!\n\n🧠 **अॅक्टिव्ह रिकॉल आव्हान:**\n१. भारतात आर्थिक आणीबाणी आतापर्यंत किती वेळा लागू झाली? *(उत्तर: शून्य / एकदाही नाही)*`,
          hi: `⚡ **एक्टिव रिकॉल: आपातकालीन प्रावधान (भाग XVIII, अनुच्छेद 352–360)**\n\n🎯 **मुख्य परीक्षा तथ्य:**\n• **राष्ट्रीय आपातकाल (अनुच्छेद 352):** आधार: युद्ध, बाह्य आक्रमण, या सशस्त्र विद्रोह (44वें संशोधन द्वारा). कैबिनेट की लिखित सिफारिश पर ही उद्घोषणा; 1 माह के भीतर विशेष बहुमत से संसद द्वारा अनुमोदन अनिवार्य.\n• **राष्ट्रपति शासन (अनुच्छेद 356):** राज्य में संवैधानिक तंत्र की विफलता पर. 2 माह में साधारण बहुमत से अनुमोदन; अधिकतम 3 वर्ष.\n• **वित्तीय आपातकाल (अनुच्छेद 360):** भारत में अब तक एक बार भी लागू नहीं किया गया है!`
        }
      }
    ]
  },
  history: {
    id: 'history',
    title: {
      en: '🏛️ Modern History',
      mr: '🏛️ आधुनिक भारताचा इतिहास',
      hi: '🏛️ आधुनिक भारतीय इतिहास'
    },
    intro: {
      en: '🏛️ **Modern Indian History Revision**\n\nSelect a freedom movement milestone or institutional phase to test your chronology, key leaders, and British commissions:',
      mr: '🏛️ **आधुनिक भारताचा इतिहास उजळणी (Modern History Revision)**\n\nकालक्रम, महत्त्वाच्या चळवळी, कायदे आणि समाजसुधारक यांची उजळणी करण्यासाठी खालील घटकावर टॅप करा:',
      hi: '🏛️ **आधुनिक भारत का इतिहास रिवीजन**\n\nघटनाक्रम, प्रमुख आंदोलन, समाज सुधारक और ऐतिहासिक संधियों की समीक्षा के लिए नीचे दिए गए टॉपिक पर टैप करें:'
    },
    topics: [
      {
        id: 'revolt1857',
        label: {
          en: '🔥 1857 Revolt & British Policies',
          mr: '🔥 १८५७ चा उठाव व ब्रिटिश धोरणे',
          hi: '🔥 1857 का विद्रोह एवं ब्रिटिश नीतियां'
        },
        card: {
          en: `🔥 **Active Recall: 1857 Revolt & Government of India Act 1858**\n\n🎯 **Core Exam Essentials:**\n• **Immediate Trigger:** Greased cartridge incident at Barrackpore (Mangal Pandey, March 1857); outbreak at Meerut on 10 May 1857.\n• **Key Centers & Leaders:** Delhi (General Bakht Khan / Bahadur Shah Zafar), Kanpur (Nana Saheb / Tantia Tope), Lucknow (Begum Hazrat Mahal), Jhansi (Rani Laxmibai), Bihar/Jagdishpur (Kunwar Singh), Faizabad (Maulvi Ahmadullah).\n• **British Commanders:** Delhi (John Nicholson, Hudson), Kanpur & Lucknow (Colin Campbell), Jhansi & Gwalior (Hugh Rose).\n• **Government of India Act 1858 (Queen's Proclamation):** Abolished East India Company rule; governance transferred to British Crown. Governor-General designated as Viceroy (Lord Canning was first Viceroy). Board of Control & Court of Directors abolished.\n\n🧠 **Active Recall Challenge:**\n1. Who led the 1857 revolt in Jagdishpur, Bihar at age 80? *(Answer: Veer Kunwar Singh)*\n2. Which commission was appointed for Indian Army reorganization after 1857? *(Answer: Peel Commission - ratio of European to Indian soldiers increased)*`,
          mr: `🔥 **अॅक्टिव्ह रिकॉल: १८५७ चा उठाव व १८५८ चा राणीचा जाहीरनामा**\n\n🎯 **परीक्षेसाठी महत्त्वाचे मुद्दे:**\n• **तात्कालिक कारण:** एनफिल्ड रायफलींची चरबीयुक्त काडतुसे (मंगल पांडे, बराकपूर छावणी). प्रत्यक्ष उठावाची सुरुवात १० मे १८५७ मीरत येथे.\n• **प्रमुख केंद्रे व नेते:** दिल्ली (बहादूर शाह जफर / बख्त खान), कानपूर (नानासाहेब पेशवे / तात्या टोपे), झाशी (राणी लक्ष्मीबाई), बिहार (कुंवर सिंह), लखनौ (बेगम हजरत महल).\n• **महाराष्ट्रातील उठाव:** सातारा (रंगो बापूजी गुप्ते), कोल्हापूर (चिमणासाहेब), पेठ (राजा भगवंतराव), खान्देश (कजारसिंग व भील बंधू).\n• **१८५८ चा कायदा:** ईस्ट इंडिया कंपनीची सत्ता समाप्त होऊन ब्रिटनच्या राणीची थेट सत्ता सुरू झाली. गव्हर्नर जनरल आता 'व्हाईसरॉय' बनला (लॉर्ड कॅनिंग पहिला व्हाईसरॉय).\n\n🧠 **अॅक्टिव्ह रिकॉल आव्हान:**\n१. १८५७ नंतर सैन्याची फेररचना करण्यासाठी कोणता आयोग नेमला गेला? *(उत्तर: पील कमिशन / Peel Commission)*`,
          hi: `🔥 **एक्टिव रिकॉल: 1857 का विद्रोह एवं 1858 का अधिनियम**\n\n🎯 **मुख्य परीक्षा तथ्य:**\n• **शुरुआत:** 10 मई 1857, मेरठ छावनी.\n• **प्रमुख नेतृत्व:** दिल्ली (बहादुर शाह / बख्त खान), कानपुर (नाना साहब), झांसी (रानी लक्ष्मीबाई), बिहार (कुंवर सिंह), लखनऊ (बेगम हजरत महल).\n• **परिणाम:** ईस्ट इंडिया कंपनी का शासन समाप्त; ब्रिटिश क्राउन का प्रत्यक्ष शासन शुरू. लॉर्ड कैनिंग भारत के पहले वायसराय बने.\n• **पील कमीशन (Peel Commission):** सेना के पुनर्गठन के लिए गठित हुआ.`
        }
      },
      {
        id: 'inc_movements',
        label: {
          en: '✊ Non-Cooperation & Civil Disobedience',
          mr: '✊ असहकार व सविनय कायदेभंग चळवळ',
          hi: '✊ असहयोग एवं सविनय अवज्ञा आंदोलन'
        },
        card: {
          en: `✊ **Active Recall: Gandhian Movements (1920–1934)**\n\n🎯 **Core Exam Essentials:**\n• **Non-Cooperation Movement (1920–1922):** Approved at Nagpur Session (Dec 1920). Boycott of foreign goods, schools, and titles (Gandhi returned Kaiser-i-Hind). Abruptly withdrawn after Chauri Chaura incident (Feb 1922).\n• **Swaraj Party (1923):** Formed by C.R. Das and Motilal Nehru to contest council elections.\n• **Civil Disobedience Movement (1930–1934):** Began with Dandi Salt March (12 March to 6 April 1930; Sabarmati to Dandi, 240 miles, 78 followers). Broke salt law.\n• **Gandhi-Irwin Pact (March 1931):** Congress agreed to participate in 2nd Round Table Conference and suspend CDM.\n• **Poona Pact (1932):** Agreement between Mahatma Gandhi and Dr. B.R. Ambedkar; rejected separate electorates for depressed classes and increased reserved seats from 71 to 148.\n\n🧠 **Active Recall Challenge:**\n1. Who led the Salt Satyagraha raid on Dharasana Salt Works after Gandhi's arrest? *(Answer: Sarojini Naidu, Imam Saheb, and Manilal)*\n2. Which Round Table Conference was attended by Mahatma Gandhi? *(Answer: Only the 2nd Round Table Conference in 1931)*`,
          mr: `✊ **अॅक्टिव्ह रिकॉल: असहकार चळवळ व सविनय कायदेभंग (१९२०-१९३४)**\n\n🎯 **परीक्षेसाठी महत्त्वाचे मुद्दे:**\n• **असहकार चळवळ (१९२०-१९२२):** नागपूर अधिवेशनात मंजुरी (१९२०). परदेशी मालावर बहिष्कार व पदव्यांचा त्याग. चौरीचौरा घटनेनंतर (फेब्रुवारी १९२२) गांधीजींनी चळवळ स्थगित केली.\n• **स्वराज्य पक्ष (१९२३):** चित्तरंजन दास व मोतीलाल नेहरू यांनी स्थापन केला.\n• **सविनय कायदेभंग चळवळ (१९३०):** ऐतिहासिक दांडी यात्रा (१२ मार्च ते ६ एप्रिल १९३०; २४० मैल, ७८ अनुयायी). मिठाचा कायदा मोडला.\n• **महाराष्ट्रातील सविनय कायदेभंग:** वडाळा सॉल्ट सत्याग्रह, बिळाशी (सांगली) जंगल सत्याग्रह, सोलापूर मार्शल लॉ.\n• **पुणे करार (१९३२):** येरवडा तुरुंगात महात्मा गांधी व डॉ. बाबासाहेब आंबेडकर यांच्यात करार; स्वतंत्र मतदारसंघ नाकारून राखीव जागा ७१ वरून १४८ करण्यात आल्या.\n\n🧠 **अॅक्टिव्ह रिकॉल आव्हान:**\n१. महात्मा गांधींनी कोणत्या गोलमेज परिषदेला हजेरी लावली होती? *(उत्तर: फक्त दुसरी गोलमेज परिषद, १९३१)*`,
          hi: `✊ **एक्टिव रिकॉल: असहयोग एवं सविनय अवज्ञा आंदोलन**\n\n🎯 **मुख्य परीक्षा तथ्य:**\n• **असहयोग आंदोलन (1920-22):** चौरी-चौरा कांड के बाद गांधीजी ने वापस लिया.\n• **दांडी मार्च (1930):** 12 मार्च से 6 अप्रैल 1930, साबरमती से दांडी तक नमक कानून तोड़कर सविनय अवज्ञा आंदोलन की शुरुआत.\n• **गांधी-इरविन समझौता (1931):** कांग्रेस द्वितीय गोलमेज सम्मेलन में शामिल होने पर सहमत हुई.\n• **पूना पैक्ट (1932):** गांधीजी और डॉ. अम्बेडकर के बीच समझौता; पृथक निर्वाचक मंडल के बजाय आरक्षित सीटों पर सहमति.`
        }
      },
      {
        id: 'quit_india',
        label: {
          en: '🇮🇳 Quit India Movement (1942)',
          mr: '🇮🇳 चले जाव / भारत छोडो चळवळ (१९४२)',
          hi: '🇮🇳 भारत छोड़ो आंदोलन (1942)'
        },
        card: {
          en: `🇮🇳 **Active Recall: Quit India Movement (August Kranti 1942)**\n\n🎯 **Core Exam Essentials:**\n• **Context:** Failure of Cripps Mission (March 1942) and threat of Japanese invasion.\n• **Resolution:** Passed at Gowalia Tank Maidan (August Kranti Maidan), Bombay on 8 August 1942. Gandhi gave the famous mantra: *"Do or Die"* (करेंगे या मरेंगे).\n• **Operation Zero Hour:** British arrested all top leaders (Gandhi, Nehru, Patel) early morning of 9 August 1942.\n• **Underground Leadership:** Aruna Asaf Ali (hoisted flag at Gowalia Tank), Jayaprakash Narayan, Ram Manohar Lohia, Usha Mehta (secret underground radio in Bombay).\n• **Parallel Governments (Prati Sarkar):**\n  - Satara (Maharashtra) under Krantisinh Nana Patil.\n  - Ballia (UP) under Chittu Pandey.\n  - Tamluk / Midnapore (Bengal) under Jatiya Sarkar.\n\n🧠 **Active Recall Challenge:**\n1. Who set up the underground Congress Radio during Quit India? *(Answer: Usha Mehta)*\n2. Where was the famous 'Prati Sarkar' formed in Maharashtra? *(Answer: Satara, led by Nana Patil)*`,
          mr: `🇮🇳 **अॅक्टिव्ह रिकॉल: चले जाव चळवळ (ऑगस्ट क्रांती १९४२)**\n\n🎯 **परीक्षेसाठी महत्त्वाचे मुद्दे:**\n• **पार्श्वभूमी:** क्रिप्स मिशनचे अपयश आणि जपानी आक्रमणाची भीती.\n• **ठराव:** ८ ऑगस्ट १९४२ रोजी मुंबईच्या गवालिया टँक मैदानावर (ऑगस्ट क्रांती मैदान) चले जाव ठराव मंजूर. गांधीजींचा मंत्र: *"करा किंवा मरा" (Do or Die)*.\n• **ऑपरेशन झिरो अवर:** ९ ऑगस्टच्या पहाटेच सर्व प्रमुख नेत्यांना अटक.\n• **भूमिगत चळवळ:** अरुणा असफ अली, जयप्रकाश नारायण, डॉ. राम मनोहर लोहिया, उषा मेहता (मुंबईत गुप्त काँग्रेस रेडिओ केंद्र).\n• **प्रतिसरकार (Parallel Government):** सातारा जिल्ह्यात क्रांतिसिंह नाना पाटील यांच्या नेतृत्वाखालील प्रतिसरकार (तुफान सेना).\n\n🧠 **अॅक्टिव्ह रिकॉल आव्हान:**\n१. चले जाव चळवळीदरम्यान मुंबईत गुप्त रेडिओ कोणी चालवला? *(उत्तर: उषा मेहता)*`,
          hi: `🇮🇳 **एक्टिव रिकॉल: भारत छोड़ो आंदोलन (1942)**\n\n🎯 **मुख्य परीक्षा तथ्य:**\n• **मंत्र:** महात्मा गांधी ने "करो या मरो" (Do or Die) का नारा दिया (ग्वालिया टैंक, मुंबई, 8 अगस्त 1942).\n• **ऑपरेशन जीरो आवर:** 9 अगस्त को सभी बड़े नेता गिरफ्तार कर लिए गए.\n• **समानांतर सरकारें:** बलिया (चित्तू पांडे), सतारा (नाना पाटिल), और तामलुक (जातीय सरकार).\n• **भूमिगत रेडियो:** उषा मेहता द्वारा मुंबई में गुप्त रूप से संचालित.`
        }
      },
      {
        id: 'socio_reform',
        label: {
          en: '🌱 Socio-Religious Reformers & Thinkers',
          mr: '🌱 समाजसुधारक (फुले, आंबेडकर, शाहू महाराज)',
          hi: '🌱 प्रमुख समाज सुधारक एवं आंदोलन'
        },
        card: {
          en: `🌱 **Active Recall: Socio-Religious Reformers (UPSC & MPSC Core)**\n\n🎯 **Core Exam Essentials:**\n• **Raja Ram Mohan Roy:** Brahmo Samaj (1828); fought against Sati (Regulation XVII, 1829 under Lord William Bentinck); father of Indian Renaissance.\n• **Ishwar Chandra Vidyasagar:** Hindu Widows' Remarriage Act (1856 under Canning).\n• **Jyotirao Phule:** Founded Satyashodhak Samaj (1873); first girls' school at Bhide Wada, Pune (1848 with Savitribai Phule); authored *Gulamgiri* and *Shetkaryacha Asud*.\n• **Chhatrapati Shahu Maharaj:** Kolhapur decree granting 50% reservation for backward classes (1902); supported Dr. Ambedkar's *Mooknayak*.\n• **Dr. B.R. Ambedkar:** Founded Bahishkrit Hitakarini Sabha (1924); Mahad Satyagraha (1927 for Chavdar Tale water rights); Kalaram Temple entry (1930); authored *Annihilation of Caste*.\n\n🧠 **Active Recall Challenge:**\n1. In which year did Dr. B.R. Ambedkar lead the Mahad Satyagraha? *(Answer: 1927)*\n2. Who founded Satyashodhak Samaj in 1873? *(Answer: Mahatma Jyotirao Phule)*`,
          mr: `🌱 **अॅक्टिव्ह रिकॉल: महाराष्ट्रातील व भारतातील प्रमुख समाजसुधारक**\n\n🎯 **परीक्षेसाठी महत्त्वाचे मुद्दे:**\n• **महात्मा ज्योतिराव फुले:** सत्यशोधक समाजाची स्थापना (२४ सप्टेंबर १८७३). भिडे वाड्यात मुलींची पहिली शाळा (१८४८). ग्रंथ: *गुलामगिरी*, *शेतकऱ्याचा असूड*, *सार्वजनिक सत्यधर्म*.\n• **छत्रपती राजर्षी शाहू महाराज:** कोल्हापूर संस्थानात बहुजन समाजाला ५०% आरक्षण (२६ जुलै १९०२). प्राथमिक शिक्षण मोफत व सक्तीचे. डॉ. आंबेडकरांच्या 'मूकनायक' वृत्तपत्रास आर्थिक मदत.\n• **डॉ. बाबासाहेब आंबेडकर:** बहिष्कृत हितकारिणी सभा (१९२४). महाड चवदार तळे सत्याग्रह (२० मार्च १९२७ - सामाजिक समता दिन). काळाराम मंदिर सत्याग्रह (१९३०). स्वतंत्र मजूर पक्ष व शेड्युल्ड कास्ट्स फेडरेशन.\n• **गोपाळ गणेश आगरकर:** 'सुधारक' वृत्तपत्र सुरू केले; "इष्ट असेल ते बोलणार आणि साध्य असेल ते करणार" हे ब्रीदवाक्य.\n\n🧠 **अॅक्टिव्ह रिकॉल आव्हान:**\n१. महाड येथील चवदार तळ्याचा सत्याग्रह कोणत्या वर्षी झाला? *(उत्तर: २० मार्च १९२७)*`,
          hi: `🌱 **एक्टिव रिकॉल: प्रमुख समाज सुधारक एवं आंदोलन**\n\n🎯 **मुख्य परीक्षा तथ्य:**\n• **राजा राममोहन राय:** ब्रह्म समाज (1828), 1829 में सती प्रथा उन्मूलन में मुख्य भूमिका.\n• **महात्मा ज्योतिराव फुले:** सत्यशोधक समाज (1873), 'गुलामगिरी' के लेखक.\n• **डॉ. बी.आर. अम्बेडकर:** महाड़ सत्याग्रह (1927), बहिष्कृत हितकारिणी सभा (1924).\n• **ईश्वरचंद्र विद्यासागर:** 1856 में हिंदू विधवा पुनर्विवाह अधिनियम पारित कराने में मुख्य योगदान.`
        }
      }
    ]
  },
  geography: {
    id: 'geography',
    title: {
      en: '🌍 Geography',
      mr: '🌍 भूगोल व नकाशे',
      hi: '🌍 भूगोल एवं मानचित्र'
    },
    intro: {
      en: '🌍 **Indian & Physical Geography Revision**\n\nSelect a physical feature, river network, or climate topic to test your geographic recall and map mastery:',
      mr: '🌍 **भूगोल उजळणी (Geography Revision)**\n\nप्राकृतिक रचना, मान्सून प्रणाली, नदीप्रणाली व मृदा प्रकार यांची उजळणी करण्यासाठी खालील घटकावर टॅप करा:',
      hi: '🌍 **भूगोल एवं पर्यावरण रिवीजन**\n\nभारत की प्राकृतिक संरचना, मानसून, प्रमुख नदी तंत्र व मिट्टी के वर्गीकरण का रिवीजन करने के लिए टॉपिक चुनें:'
    },
    topics: [
      {
        id: 'monsoon',
        label: {
          en: '🌧️ Indian Monsoon & Climate Mechanism',
          mr: '🌧️ भारतीय मान्सून व हवामान प्रणाली',
          hi: '🌧️ भारतीय मानसून व जलवायु प्रणाली'
        },
        card: {
          en: `🌧️ **Active Recall: Indian Monsoon Mechanism**\n\n🎯 **Core Exam Essentials:**\n• **South-West Monsoon (June–Sept):** Accounts for 75%+ of India's annual rainfall. Splits into Arabian Sea branch and Bay of Bengal branch.\n• **Thermal Concept (Halley):** Differential heating of land and sea creates low pressure over Tibetan Plateau and NW India.\n• **Dynamic Drivers:**\n  - Tropical Easterly Jet (TEJ) over peninsular India.\n  - Somali Jet stream accelerates winds across Arabian Sea.\n  - Inter-Tropical Convergence Zone (ITCZ) shifts northward to Ganga plains in summer (Monsoon Trough).\n• **ENSO & IOD:**\n  - El Niño (warming of central/eastern Pacific) generally correlates with suppressed Indian monsoon.\n  - Positive Indian Ocean Dipole (IOD) enhances Indian monsoon rainfall.\n\n🧠 **Active Recall Challenge:**\n1. Which coast in India receives majority of its rain from the North-East (retreating) monsoon? *(Answer: Coromandel Coast / Tamil Nadu)*\n2. What is the effect of a positive IOD on Indian monsoon? *(Answer: Enhances rainfall / favorable)*`,
          mr: `🌧️ **अॅक्टिव्ह रिकॉल: भारतीय मान्सून व हवामान प्रणाली**\n\n🎯 **परीक्षेसाठी महत्त्वाचे मुद्दे:**\n• **नैऋत्य मान्सून (जून ते सप्टेंबर):** भारताला ७५% पेक्षा जास्त पाऊस देतो. दोन शाखा: अरबी समुद्राची शाखा व बंगालच्या उपसागराची शाखा.\n• **सह्याद्रीचा प्रभाव (महाराष्ट्र):** सह्याद्री पर्वतामुळे कोकणात जोरदार प्रतिरोध (Orographic) पाऊस पडतो, तर पूर्व बाजूला 'पर्जन्यछायेचा प्रदेश' तयार होतो.\n• **अंबोली:** महाराष्ट्रात सर्वाधिक पाऊस पडणारे ठिकाण (~७५० सेमी).\n• **एल निनो (El Niño):** पॅसिफिक महासागराचे पाणी प्रमाणाबाहेर तापल्याने भारतीय मान्सूनवर विपरीत परिणाम होतो आणि दुष्काळाची शक्यता वाढते.\n\n🧠 **अॅक्टिव्ह रिकॉल आव्हान:**\n१. महाराष्ट्रात सर्वाधिक पाऊस कोणत्या ठिकाणी पडतो? *(उत्तर: आंबोली, सिंधुदुर्ग)*`,
          hi: `🌧️ **एक्टिव रिकॉल: भारतीय मानसून प्रणाली**\n\n🎯 **मुख्य परीक्षा तथ्य:**\n• **दक्षिण-पश्चिम मानसून:** जून से सितंबर तक भारत की 75% वर्षा इसी से होती है.\n• **कोरोमंडल तट (तमिलनाडु):** लौटते हुए उत्तर-पूर्वी मानसून (अक्टूबर-दिसंबर) से वर्षा प्राप्त करता है.\n• **एल-नीनो प्रभाव:** भारतीय मानसून को कमजोर करता है; जबकि पॉजिटिव IOD अच्छी वर्षा में सहायक है.`
        }
      },
      {
        id: 'rivers',
        label: {
          en: '🌊 River Systems (Ganga, Godavari, Krishna)',
          mr: '🌊 नदीप्रणाली (गोदावरी, भीमा, कृष्णा)',
          hi: '🌊 प्रमुख नदी तंत्र (गंगा, गोदावरी, कृष्णा)'
        },
        card: {
          en: `🌊 **Active Recall: Major River Systems of India & Maharashtra**\n\n🎯 **Core Exam Essentials:**\n• **Himalayan vs Peninsular:** Himalayan rivers are perennial (glacier-fed) and antecedent; Peninsular rivers are seasonal and rain-fed.\n• **Ganga System:** Originates as Bhagirathi at Gaumukh (Gangotri); meets Alaknanda at Devprayag to form Ganga. Right tributaries: Yamuna, Son. Left: Ramganga, Gomti, Ghaghara, Gandak, Kosi.\n• **Godavari (Dakshin Ganga):** Longest peninsular river (~1,465 km). Originates at Trimbakeshwar (Nashik). Left bank: Purna, Pranhita (Penganga + Wardha + Wainganga), Indravati, Sabari. Right bank: Pravara, Manjra.\n• **Krishna:** Originates at Mahabaleshwar. Tributaries: Koyna, Venna, Panchganga, Dudhganga, Ghataprabha, Malaprabha, Bhima, Tungabhadra.\n\n🧠 **Active Recall Challenge:**\n1. At which Prayag do rivers Bhagirathi and Alaknanda meet to form the Ganga? *(Answer: Devprayag)*\n2. Which river is known as 'Dakshin Ganga'? *(Answer: Godavari)*`,
          mr: `🌊 **अॅक्टिव्ह रिकॉल: महाराष्ट्रातील व भारतातील प्रमुख नदीप्रणाली**\n\n🎯 **परीक्षेसाठी महत्त्वाचे मुद्दे:**\n• **गोदावरी नदी (दक्षिण गंगा):** महाराष्ट्रातील सर्वात मोठे नदीखोरे (महाराष्ट्राचे ४९% क्षेत्रफळ). उगम: त्र्यंबकेश्वर (नाशिक). लांबी: १४६५ किमी (महाराष्ट्रात ६६८ किमी). उपनद्या: प्रवरा, सिंधफणा, मांजरा (उजव्या); दारणा, कादवा, पूर्णा, प्राणहिता, इंद्रावती (डाव्या).\n• **भीमा नदी:** उगम: भीमाशंकर (पुणे). उपनद्या: कुकडी, घोड, सीना, मुळा-मुठा, नीरा. पंढरपूर येथे तिला 'चंद्रभागा' म्हणतात.\n• **कृष्णा नदी:** उगम: महाबळेश्वर (सातारा). उपनद्या: कोयना (महाराष्ट्राची भाग्यलक्ष्मी), वारणा, पंचगंगा, दूधगंगा.\n• **नर्मदा व तापी:** पश्चिमवाहिनी नद्या असून खचदरीतून (Rift Valley) वाहतात.\n\n🧠 **अॅक्टिव्ह रिकॉल आव्हान:**\n१. महाराष्ट्राची भाग्यलक्ष्मी म्हणून कोणत्या नदीस ओळखले जाते? *(उत्तर: कोयना नदी)*`,
          hi: `🌊 **एक्टिव रिकॉल: भारत के प्रमुख नदी तंत्र**\n\n🎯 **मुख्य परीक्षा तथ्य:**\n• **देवप्रयाग:** भागीरथी और अलकनंदा का संगम, जिसके बाद यह 'गंगा' कहलाती है.\n• **गोदावरी (दक्षिण गंगा):** प्रायद्वीपीय भारत की सबसे लंबी नदी (~1465 किमी), त्र्यंबकेश्वर (नासिक) से उद्गम.\n• **नर्मदा और तापी:** पश्चिम की ओर बहने वाली मुख्य नदियां जो भ्रंश घाटी (Rift Valley) से होकर अरब सागर में गिरती हैं.`
        }
      }
    ]
  },
  economy: {
    id: 'economy',
    title: {
      en: '📈 Indian Economy',
      mr: '📈 भारतीय अर्थव्यवस्था',
      hi: '📈 भारतीय अर्थव्यवस्था'
    },
    intro: {
      en: '📈 **Indian Economy Revision**\n\nSelect a macroeconomics pillar below to review monetary policy tools, budget deficits, and inflation dynamics:',
      mr: '📈 **भारतीय अर्थव्यवस्था उजळणी (Economy Revision)**\n\nरिझर्व्ह बँकेचे धोरण, अर्थसंकल्प, वित्तीय तूट व महागाई या संकल्पनांची उजळणी करण्यासाठी खालील घटकावर टॅप करा:',
      hi: '📈 **भारतीय अर्थव्यवस्था रिवीजन**\n\nमौद्रिक नीति, बजट, राजकोषीय घाटा एवं मुद्रास्फीति के प्रमुख कॉन्सेप्ट्स की त्वरित समीक्षा के लिए टॉपिक चुनें:'
    },
    topics: [
      {
        id: 'monetary',
        label: {
          en: '🏦 RBI & Monetary Policy (Repo, CRR)',
          mr: '🏦 रिझर्व्ह बँक व चलनविषयक धोरण (Repo, CRR)',
          hi: '🏦 RBI एवं मौद्रिक नीति (Repo, CRR)'
        },
        card: {
          en: `🏦 **Active Recall: RBI & Monetary Policy Tools**\n\n🎯 **Core Exam Essentials:**\n• **Monetary Policy Committee (MPC):** 6 members (3 from RBI, 3 appointed by Central Govt). RBI Governor has casting vote. Mandate: 4% CPI inflation (+/- 2% tolerance band).\n• **Quantitative Tools:**\n  - **Repo Rate:** Rate at which RBI lends short-term funds to banks against collateral.\n  - **Reverse Repo / SDF:** Rate at which RBI absorbs liquidity. Standing Deposit Facility (SDF) does not require collateral.\n  - **Cash Reserve Ratio (CRR):** Percentage of Net Demand and Time Liabilities (NDTL) banks must park as cash with RBI. No interest paid by RBI on CRR.\n  - **Statutory Liquidity Ratio (SLR):** Percentage of NDTL banks must maintain in liquid assets (cash, gold, approved Govt securities).\n• **Open Market Operations (OMO):** Outright purchase/sale of government securities to inject/absorb liquidity.\n\n🧠 **Active Recall Challenge:**\n1. If RBI increases the Repo Rate, what happens to liquidity in the economy? *(Answer: Decreases, borrowing becomes expensive, helping control inflation)*\n2. Does RBI pay interest on CRR balances? *(Answer: No)*`,
          mr: `🏦 **अॅक्टिव्ह रिकॉल: रिझर्व्ह बँक व चलनविषयक धोरण (Monetary Policy)**\n\n🎯 **परीक्षेसाठी महत्त्वाचे मुद्दे:**\n• **MPC रचना:** ६ सदस्य (३ रिझर्व्ह बँकेचे + ३ केंद्र सरकारचे). अध्यक्ष: गव्हर्नर (निर्णायक मत). मुख्य लक्ष्य: ४% महागाई दर (कमीत कमी २%, जास्तीत जास्त ६%).\n• **संख्यात्मक साधने (Quantitative Tools):**\n  - **रेपो दर (Repo Rate):** बँकांना अल्पमुदतीचे कर्ज देताना RBI आकारत असलेला व्याजदर. रेपो दर वाढवल्यास बाजारातील पैशांचा पुरवठा कमी होतो व महागाई नियंत्रणात येते.\n  - **CRR (रोख राखीव प्रमाण):** बँकांनी आपल्या एकूण ठेवींपैकी RBI कडे रोख स्वरूपात ठेवायची टक्केवारी. यावर RBI कोणतेही व्याज देत नाही.\n  - **SLR (वैधानिक तरलता प्रमाण):** बँकांनी स्वतःकडे रोख, सोने किंवा सरकारी रोखे स्वरूपात ठेवायची रक्कम.\n\n🧠 **अॅक्टिव्ह रिकॉल आव्हान:**\n१. रेपो दर वाढल्यास महागाईवर काय परिणाम होतो? *(उत्तर: महागाई कमी होण्यास मदत होते)*`,
          hi: `🏦 **एक्टिव रिकॉल: मौद्रिक नीति उपकरण (Repo, CRR, SLR)**\n\n🎯 **मुख्य परीक्षा तथ्य:**\n• **मौद्रिक नीति समिति (MPC):** 6 सदस्य, मुद्रास्फीति का लक्ष्य 4% (+/- 2%) बनाए रखना.\n• **रेपो रेट:** जिस दर पर RBI वाणिज्यिक बैंकों को अल्पकालिक ऋण देता है. रेपो बढ़ने से बाजार में नकदी कम होती है.\n• **CRR:** बैंकों को अपनी जमा का निश्चित हिस्सा RBI के पास नकद रखना अनिवार्य होता है (कोई ब्याज नहीं मिलता).`
        }
      },
      {
        id: 'budget',
        label: {
          en: '📊 Budget, Fiscal Deficit & Taxation',
          mr: '📊 अर्थसंकल्प, वित्तीय तूट व कररचना',
          hi: '📊 बजट, राजकोषीय घाटा एवं कर संरचना'
        },
        card: {
          en: `📊 **Active Recall: Budgeting & Fiscal Indicators**\n\n🎯 **Core Exam Essentials:**\n• **Constitutional Term:** The word 'Budget' is not used in the Constitution; Art 112 refers to it as "Annual Financial Statement".\n• **Key Deficit Formulas:**\n  - **Fiscal Deficit:** Total Expenditure - Total Receipts (excluding borrowings). Represents government's total borrowing requirement.\n  - **Revenue Deficit:** Revenue Expenditure - Revenue Receipts.\n  - **Primary Deficit:** Fiscal Deficit - Interest Payments. (Shows borrowing needed for non-interest expenses).\n• **Consolidated Fund of India (Art 266):** All revenues and loans go here; withdrawal requires Parliament appropriation.\n• **Contingency Fund (Art 267):** At disposal of President for unforeseen emergencies.\n\n🧠 **Active Recall Challenge:**\n1. What is Primary Deficit? *(Answer: Fiscal Deficit minus Interest Payments)*`,
          mr: `📊 **अॅक्टिव्ह रिकॉल: अर्थसंकल्प आणि वित्तीय तूट (Fiscal Deficit)**\n\n🎯 **परीक्षेसाठी महत्त्वाचे मुद्दे:**\n• **घटनात्मक उल्लेख:** संविधानात 'बजेट' शब्द नसून कलम ११२ मध्ये "वार्षिक वित्तीय विवरणपत्र" असा उल्लेख आहे.\n• **महत्त्वाच्या तुटींची सूत्रे:**\n  - **राजकोषीय तूट (Fiscal Deficit):** एकूण खर्च - कर्ज वगळून एकूण उत्पन्न. ही सरकारची प्रत्यक्ष कर्जाची गरज दर्शवते.\n  - **महसुली तूट (Revenue Deficit):** महसुली खर्च - महसुली उत्पन्न.\n  - **प्राथमिक तूट (Primary Deficit):** राजकोषीय तूट - व्याजाचे देणे.\n• **भारताचा एकत्रित निधी (कलम २६६):** संसदेच्या मंजुरीशिवाय यातून एकही रुपया खर्च करता येत नाही.\n\n🧠 **अॅक्टिव्ह रिकॉल आव्हान:**\n१. प्राथमिक तूट म्हणजे काय? *(उत्तर: राजकोषीय तूट वजा व्याजाची रक्कम)*`,
          hi: `📊 **एक्टिव रिकॉल: बजट एवं राजकोषीय घाटा**\n\n🎯 **मुख्य परीक्षा तथ्य:**\n• **अनुच्छेद 112:** वार्षिक वित्तीय विवरण (बजट शब्द संविधान में नहीं है).\n• **राजकोषीय घाटा:** कुल व्यय - (उधार छोड़कर कुल प्राप्तियां). यह सरकार की कुल उधारी को दर्शाता है.\n• **प्राथमिक घाटा:** राजकोषीय घाटा - ब्याज भुगतान.`
        }
      }
    ]
  },
  csat: {
    id: 'csat',
    title: {
      en: '📐 CSAT & Aptitude',
      mr: '📐 CSAT बुद्धिमत्ता व अंकगणित',
      hi: '📐 CSAT गणित व रीजनिंग'
    },
    intro: {
      en: '📐 **CSAT (Paper II) Strategy & Revision**\n\nQualifying score is 33% (66 marks out of 200). Select an aptitude shortcut or reasoning method to review formulas:',
      mr: '📐 **CSAT बुद्धिमत्ता व अंकगणित उजळणी**\n\nCSAT पेपरमध्ये ३३% गुण मिळवणे अनिवार्य असते. गुण वाढवणारे शॉर्टकट्स व सूत्रे पाहण्यासाठी खालील घटकावर टॅप करा:',
      hi: '📐 **CSAT गणित एवं रीजनिंग रिवीजन**\n\nCSAT में 33% (66 अंक) क्वालिफाइंग है. महत्वपूर्ण फॉर्मूले और शॉर्टकट्स के रिवीजन के लिए टॉपिक चुनें:'
    },
    topics: [
      {
        id: 'speed_time',
        label: {
          en: '⏱️ Time, Speed & Distance / Work',
          mr: '⏱️ वेळ, वेग व अंतर / काम-काळ-वेग',
          hi: '⏱️ समय, चाल, दूरी एवं कार्य'
        },
        card: {
          en: `⏱️ **Active Recall: CSAT Speed, Distance & Time Formulas**\n\n🎯 **Core Shortcuts:**\n• **Unit Conversion:** km/h to m/s = Multiply by 5/18. m/s to km/h = Multiply by 18/5.\n• **Average Speed:** When distance is same: Avg Speed = \`2xy / (x + y)\`.\n• **Relative Speed:**\n  - Moving in opposite directions: Relative Speed = \`x + y\`.\n  - Moving in same direction: Relative Speed = \`x - y\`.\n• **Trains Crossing:** Distance covered = Length of Train + Length of Platform/Bridge.\n• **Time & Work:** If A does a work in X days and B in Y days, together they finish in \`XY / (X + Y)\` days.\n\n🧠 **Active Recall Challenge:**\n1. How do you convert 72 km/h into m/s? *(Answer: 72 * (5/18) = 20 m/s)*`,
          mr: `⏱️ **अॅक्टिव्ह रिकॉल: CSAT वेग, वेळ व अंतर / काम-काळ**\n\n🎯 **महत्त्वाची सूत्रे व शॉर्टकट्स:**\n• **एकक रूपांतर:** किमी/तास चे मी/सेकंद करताना: \`५/१८\` ने गुणावे. (उदा. ९० किमी/तास = ९० * ५/१८ = २५ मी/से).\n• **सरासरी वेग (समान अंतर):** \`२xy / (x + y)\`.\n• **आगगाडीचे गणित:** खांब ओलांडताना लागणारे अंतर = फक्त ट्रेनची लांबी; पूल ओलांडताना = ट्रेन + पूलाची लांबी.\n• **काम व काळ:** A ला एक काम १० दिवस व B ला १५ दिवस लागतात, तर एकत्र: \`(१० * १५) / (१० + १५) = १५०/२५ = ६ दिवस\`.\n\n🧠 **अॅक्टिव्ह रिकॉल आव्हान:**\n१. ५४ किमी/तास म्हणजे किती मीटर/सेकंद? *(उत्तर: ५४ * ५/१८ = १५ मी/से)*`,
          hi: `⏱️ **एक्टिव रिकॉल: समय, चाल एवं दूरी (CSAT)**\n\n🎯 **मुख्य सूत्र:**\n• **इकाई परिवर्तन:** किमी/घंटा से मी/सेकंड बदलने के लिए \`5/18\` से गुणा करें.\n• **औसत चाल:** समान दूरी पर \`2xy / (x + y)\`.\n• **सापेक्ष चाल:** विपरीत दिशा में जुड़ती है (\`x + y\`), समान दिशा में घटती है (\`x - y\`).`
        }
      },
      {
        id: 'rc',
        label: {
          en: '📖 Reading Comprehension Core Rules',
          mr: '📖 उतारा वाचन आकलन (Comprehension)',
          hi: '📖 गद्यांश बोध (Comprehension)'
        },
        card: {
          en: `📖 **Active Recall: CSAT Reading Comprehension Rules**\n\n🎯 **Golden Rules to Avoid Negative Marking:**\n1. **Stick strictly to the Passage:** Even if your real-world GS knowledge contradicts the passage, only what is in the passage is TRUE.\n2. **Beware of Extreme Words:** Options with *always, never, all, completely, solely, must* are incorrect 90% of the time.\n3. **Assumption vs Inference:**\n   - *Assumption:* The unstated premise that the author MUST believe to make the argument.\n   - *Inference / Corollary:* Logical conclusion drawn directly from facts provided in passage.\n4. **Critical Message:** Must represent the author's primary central point, not a secondary passing example.`,
          mr: `📖 **अॅक्टिव्ह रिकॉल: CSAT उतारा वाचन (Comprehension) नियम**\n\n🎯 **निगेटिव्ह मार्किंग टाळण्यासाठी सुवर्ण नियम:**\n१. **उताऱ्याच्या बाहेरचा विचार करू नका:** तुमच्या सामान्य ज्ञानानुसार गोष्ट बरोबर असली तरी, उताऱ्यात उल्लेख नसेल तर ती निवडू नका.\n२. **अतिरेकी शब्दांपासून सावध राहा:** पर्यायामध्ये *केवळ, कधीही नाही, संपूर्णपणे, नेहमी, अनिवार्य* असे अतिरेकी शब्द असल्यास तो पर्याय सहसा चुकीचा असतो.\n३. **मध्यवर्ती कल्पना (Central Idea):** संपूर्ण उताऱ्याचा मुख्य उद्देश दर्शवणारा पर्याय निवडा, एखाद्या परिच्छेदातील उदाहरण नव्हे!`,
          hi: `📖 **एक्टिव रिकॉल: गद्यांश बोध (Comprehension Rules)**\n\n🎯 **सटीक उत्तर चुनने के नियम:**\n1. **गद्यांश तक सीमित रहें:** अपने व्यक्तिगत ज्ञान या पूर्वग्रह को उत्तर में न लाएं.\n2. **चरम शब्दों (Extreme Words) से बचें:** केवल (only), कभी नहीं (never), पूर्णतः (all/completely) वाले विकल्प अधिकांशतः गलत होते हैं.\n3. **मुख्य संदेश (Crux):** लेखक के मूल तार्किक निष्कर्ष को पहचानें.`
        }
      }
    ]
  },
  environment: {
    id: 'environment',
    title: {
      en: '🌿 Environment & Ecology',
      mr: '🌿 पर्यावरण व परिसंस्था',
      hi: '🌿 पर्यावरण एवं पारिस्थितिकी'
    },
    intro: {
      en: '🌿 **Environment & Ecology Revision**\n\nSelect a biodiversity hotspot, wildlife protection act, or climate convention below to review core facts:',
      mr: '🌿 **पर्यावरण व परिसंस्था उजळणी**\n\nवन्यजीव संरक्षण कायदे, राष्ट्रीय उद्याने, हवामान बदल व परिषदा यांची उजळणी करण्यासाठी घटकावर टॅप करा:',
      hi: '🌿 **पर्यावरण एवं पारिस्थितिकी रिवीजन**\n\nजैव विविधता हॉटस्पॉट, वन्यजीव संरक्षण अधिनियम व कॉप सम्मेलनों की त्वरित समीक्षा के लिए टॉपिक चुनें:'
    },
    topics: [
      {
        id: 'wildlife',
        label: {
          en: '🐅 National Parks & Wildlife Protection Act 1972',
          mr: '🐅 राष्ट्रीय उद्याने व वन्यजीव संरक्षण कायदा १९७२',
          hi: '🐅 राष्ट्रीय उद्यान एवं वन्यजीव संरक्षण अधिनियम'
        },
        card: {
          en: `🐅 **Active Recall: Wildlife Protection Act 1972 & National Parks**\n\n🎯 **Core Exam Essentials:**\n• **WPA 1972 Structure:** Established 6 schedules (rationalized to 4 in 2022 amendment):\n  - Schedule I: Highest protection and harshest penalties (Tiger, Lion, Elephant, Great Indian Bustard).\n• **Key Projects:** Project Tiger (1973 - Corbett NP), Project Elephant (1992), Project Rhino (2005).\n• **National Park vs Sanctuary:**\n  - National Park: Higher degree of protection; human activities/grazing strictly prohibited.\n  - Wildlife Sanctuary: Limited human activities and regulated grazing permitted.\n• **Maharashtra National Parks (6):** Tadoba (Chandrapur), Sanjay Gandhi (Borivali), Gugamal (Amravati), Navegaon (Gondia), Pench (Nagpur), Chandoli (Sangli/Satara/Kolhapur).\n\n🧠 **Active Recall Challenge:**\n1. Which is the oldest national park in India? *(Answer: Jim Corbett NP, Uttarakhand, established in 1936 as Hailey NP)*\n2. In which year was Project Tiger launched? *(Answer: 1973)*`,
          mr: `🐅 **अॅक्टिव्ह रिकॉल: वन्यजीव संरक्षण कायदा १९७२ व राष्ट्रीय उद्याने**\n\n🎯 **परीक्षेसाठी महत्त्वाचे मुद्दे:**\n• **वन्यजीव संरक्षण कायदा १९७२:** प्राण्यांची शिकार व तस्करी रोखण्यासाठी मुख्य कायदा.\n• **प्रकल्प:** प्रोजेक्ट टायगर (१९७३), प्रोजेक्ट एलिफंट (१९९२).\n• **महाराष्ट्रातील ६ राष्ट्रीय उद्याने:**\n  १. ताडोबा राष्ट्रीय उद्यान (चंद्रपूर - पहिले राष्ट्रीय उद्यान, १९५५)\n  २. संजय गांधी राष्ट्रीय उद्यान (बोरिवली, मुंबई)\n  ३. गुगामल राष्ट्रीय उद्यान (मेळघाट, अमरावती)\n  ४. नवेगाव राष्ट्रीय उद्यान (गोंदिया)\n  ५. पेंच राष्ट्रीय उद्यान (नागपूर)\n  ६. चांदोली राष्ट्रीय उद्यान (सांगली, सातारा, कोल्हापूर सीमा).\n\n🧠 **अॅक्टिव्ह रिकॉल आव्हान:**\n१. महाराष्ट्रातील पहिले राष्ट्रीय उद्यान कोणते? *(उत्तर: ताडोबा, चंद्रपूर)*`,
          hi: `🐅 **एक्टिव रिकॉल: वन्यजीव संरक्षण एवं राष्ट्रीय उद्यान**\n\n🎯 **मुख्य परीक्षा तथ्य:**\n• **वन्यजीव संरक्षण अधिनियम 1972:** भारत में वन्यजीवों की सुरक्षा का आधार.\n• **प्रोजेक्ट टाइगर:** 1973 में जिम कॉर्बेट राष्ट्रीय उद्यान से शुरू.\n• **अंतर:** राष्ट्रीय उद्यान में मानवीय हस्तक्षेप व चराई पूर्णतः प्रतिबंधित होती है, जबकि अभयारण्य में सीमित अनुमति मिल सकती है.`
        }
      }
    ]
  }
};

// Build Tier 1 Menu: Subjects
function buildSubjectRevisionMenu({ selectedLang = 'en' }) {
  const isMr = selectedLang === 'mr';
  const isHi = selectedLang === 'hi';

  const title = isMr
    ? `🔁 **स्मरणशक्ती वाढवणारे रिव्हिजन तंत्र (Spaced Repetition Protocol)**\n\n• **डे १:** आज वाचलेले उद्या सकाळी १० मिनिटांत जलद नजरेखालून घाला.\n• **डे ७:** आठवड्याभरात वाचलेल्या मुख्य नोट्सची उजळणी.\n• **अॅक्टिव्ह रिकॉल:** पुस्तक बंद करून स्वतःला विचारा—*"या घटकातील ५ महत्त्वाचे मुद्दे कोणते?"*\n\n💡 **तुम्हाला आज कोणत्या विषयाची उजळणी करायची आहे?** खालील विषयावर टॅप करा:`
    : isHi
    ? `🔁 **वैज्ञानिक रिवीजन फॉर्मूला (Spaced Repetition Protocol)**\n\n• **डे 1:** आज पढ़ी हुई चीजों को कल सुबह 10 मिनट में सिर्फ सरसरी निगाह से देखें.\n• **डे 7:** पूरे सप्ताह के मुख्य नोट्स की त्वरित समीक्षा.\n• **एक्टिव रिकॉल:** किताब बंद करके याद करें कि 5 मुख्य बिंदु क्या थे.\n\n💡 **आज आप किस विषय का रिवीजन करना चाहते हैं?** नीचे दिए गए विषय पर टैप करें:`
    : `🔁 **Spaced Repetition Revision Protocol**\n\n• **Day 1 Recap:** Spend the first 10 mins of each morning reviewing yesterday's notes.\n• **Day 7 Review:** Weekly sweep of key summaries and diagrams.\n• **Active Recall:** Close the book and test yourself: *"Can I explain this topic in 3 minutes without looking?"*\n\n💡 **What subject would you like to revise today?** Choose a subject below to see key topics:`;

  const quickReplies = Object.values(REVISION_SUBJECTS).map(s => {
    return s.title[selectedLang] || s.title.en;
  });

  return {
    text: title,
    action: 'open_planner',
    suggestedActionLabel: isMr ? '📅 प्लॅनर उघडा' : isHi ? '📅 प्लानर खोलें' : '📅 Open Planner',
    quickReplies
  };
}

// Build Tier 2 Menu: Topics for selected subject
function buildTopicRevisionMenu({ subjectKey, selectedLang = 'en' }) {
  const isMr = selectedLang === 'mr';
  const isHi = selectedLang === 'hi';
  const sub = REVISION_SUBJECTS[subjectKey] || REVISION_SUBJECTS.polity;

  const intro = sub.intro[selectedLang] || sub.intro.en;
  const quickReplies = sub.topics.map(t => t.label[selectedLang] || t.label.en);
  quickReplies.push(isMr ? '🔁 दुसरा विषय निवडा' : isHi ? '🔁 दूसरा विषय चुनें' : '🔁 Switch Subject');

  return {
    text: intro,
    action: null,
    quickReplies
  };
}

// Build Tier 3: Active Recall Card for topic
function buildTopicRevisionCard({ subjectKey, topicKey, selectedLang = 'en' }) {
  const isMr = selectedLang === 'mr';
  const isHi = selectedLang === 'hi';
  const sub = REVISION_SUBJECTS[subjectKey] || REVISION_SUBJECTS.polity;
  const topic = sub.topics.find(t => t.id === topicKey) || sub.topics[0];

  const cardText = topic.card[selectedLang] || topic.card.en;

  const moreLabel = isMr
    ? `📚 ${sub.title.mr.replace(/^[^\w\s\u0900-\u097F]+/, '').trim()} इतर घटक`
    : isHi
    ? `📚 ${sub.title.hi.replace(/^[^\w\s\u0900-\u097F]+/, '').trim()} अन्य टॉपिक`
    : `📚 More ${sub.title.en.replace(/^[^\w\s]+/, '').trim()} Topics`;

  const quickReplies = [
    isMr ? '🧠 झटपट प्रश्नमंजुषा' : isHi ? '🧠 त्वरित क्विज' : '🧠 Test with Quiz',
    moreLabel,
    isMr ? '🔁 दुसरा विषय निवडा' : isHi ? '🔁 दूसरा विषय चुनें' : '🔁 Switch Subject',
    isMr ? '⏱️ २५ मिनिटे फोकस टायमर' : isHi ? '⏱️ 25 मिनट फोकस टाइमर' : '⏱️ 25m Focus Timer'
  ];

  return {
    text: cardText,
    action: 'study_concept',
    suggestedActionLabel: isMr ? '▶ २५ मिनिटांचा सराव' : isHi ? '▶ 25 मिनट फोकस' : '▶ 25m Focus Session',
    quickReplies
  };
}

function detectRevisionSubject(cleanMsg) {
  const lower = String(cleanMsg || '').toLowerCase();
  if (lower.includes('polity') || lower.includes('constitution') || lower.includes('राज्यघटना') || lower.includes('राजव्यवस्था') || lower.includes('संविधान') || lower.includes('लक्ष्मीकांत')) {
    return 'polity';
  }
  if (lower.includes('history') || lower.includes('इतिहास') || lower.includes('modern history') || lower.includes('स्वातंत्र्य') || lower.includes('विपिन चंद्र') || lower.includes('स्पेक्ट्रम')) {
    return 'history';
  }
  if (lower.includes('geography') || lower.includes('भूगोल') || lower.includes('नकाशे') || lower.includes('सह्याद्री') || lower.includes('मान्सून')) {
    return 'geography';
  }
  if (lower.includes('economy') || lower.includes('economics') || lower.includes('अर्थशास्त्र') || lower.includes('अर्थव्यवस्था') || lower.includes('अर्थसंकल्प')) {
    return 'economy';
  }
  if (lower.includes('csat') || lower.includes('aptitude') || lower.includes('reasoning') || lower.includes('बुद्धिमत्ता') || lower.includes('अंकगणित')) {
    return 'csat';
  }
  if (lower.includes('environment') || lower.includes('ecology') || lower.includes('पर्यावरण') || lower.includes('परिसंस्था') || lower.includes('wildlife')) {
    return 'environment';
  }
  return null;
}

function detectRevisionTopic(cleanMsg) {
  const lower = String(cleanMsg || '').toLowerCase();

  // Polity topics
  if (lower.includes('fundamental right') || lower.includes('art 12') || lower.includes('कलम १२') || lower.includes('मौलिक अधिकार') || lower.includes('मूलभूत हक्क') || lower.includes('art. 12') || lower.includes('art 14') || lower.includes('art 21') || lower.includes('art 32')) {
    return { subjectKey: 'polity', topicKey: 'fr' };
  }
  if (lower.includes('dpsp') || lower.includes('directive principle') || lower.includes('मार्गदर्शक') || lower.includes('कर्तव्य') || lower.includes('नीति निदेशक')) {
    return { subjectKey: 'polity', topicKey: 'dpsp' };
  }
  if (lower.includes('parliament') || lower.includes('संसद') || lower.includes('लोकसभा') || lower.includes('राज्यसभा') || lower.includes('money bill') || lower.includes('धनविधेयक')) {
    return { subjectKey: 'polity', topicKey: 'parliament' };
  }
  if (lower.includes('supreme court') || lower.includes('judicial review') || lower.includes('सर्वोच्च न्यायालय') || lower.includes('न्यायालयीन पुनर्विलोकन') || lower.includes('सुप्रीम कोर्ट') || lower.includes('collegium')) {
    return { subjectKey: 'polity', topicKey: 'judiciary' };
  }
  if (lower.includes('emergency') || lower.includes('आणीबाणी') || lower.includes('आपातकाल') || lower.includes('art 352') || lower.includes('कलम ३५२') || lower.includes('356') || lower.includes('360')) {
    return { subjectKey: 'polity', topicKey: 'emergency' };
  }

  // History topics
  if (lower.includes('1857') || lower.includes('१८५७') || lower.includes('revolt') || lower.includes('उठाव') || lower.includes('विद्रोह') || lower.includes('झाशी')) {
    return { subjectKey: 'history', topicKey: 'revolt1857' };
  }
  if (lower.includes('non-cooperation') || lower.includes('civil disobedience') || lower.includes('असहकार') || lower.includes('सविनय') || lower.includes('दांडी') || lower.includes('dandi') || lower.includes('मिठाचा सत्याग्रह') || lower.includes('poona pact') || lower.includes('पुणे करार')) {
    return { subjectKey: 'history', topicKey: 'inc_movements' };
  }
  if (lower.includes('quit india') || lower.includes('चले जाव') || lower.includes('भारत छोड़ो') || lower.includes('1942') || lower.includes('१९४२') || lower.includes('do or die') || lower.includes('प्रतिसरकार')) {
    return { subjectKey: 'history', topicKey: 'quit_india' };
  }
  if (lower.includes('reformer') || lower.includes('समाजसुधारक') || lower.includes('फुले') || lower.includes('phule') || lower.includes('आंबेडकर') || lower.includes('ambedkar') || lower.includes('शाहू') || lower.includes('shahu') || lower.includes('सत्यशोधक')) {
    return { subjectKey: 'history', topicKey: 'socio_reform' };
  }

  // Geography topics
  if (lower.includes('monsoon') || lower.includes('मान्सून') || lower.includes('मानसून') || lower.includes('climate') || lower.includes('हवामान') || lower.includes('el nino')) {
    return { subjectKey: 'geography', topicKey: 'monsoon' };
  }
  if (lower.includes('river') || lower.includes('नदी') || lower.includes('गंगा') || lower.includes('ganga') || lower.includes('गोदावरी') || lower.includes('godavari') || lower.includes('भीमा') || lower.includes('bhima') || lower.includes('कृष्णा') || lower.includes('krishna')) {
    return { subjectKey: 'geography', topicKey: 'rivers' };
  }

  // Economy topics
  if (lower.includes('monetary policy') || lower.includes('repo') || lower.includes('crr') || lower.includes('slr') || lower.includes('रेपो') || lower.includes('चलनविषयक') || lower.includes('मौद्रिक')) {
    return { subjectKey: 'economy', topicKey: 'monetary' };
  }
  if (lower.includes('deficit') || lower.includes('fiscal') || lower.includes('budget') || lower.includes('अर्थसंकल्प') || lower.includes('तूट') || lower.includes('घाटा')) {
    return { subjectKey: 'economy', topicKey: 'budget' };
  }

  // CSAT topics
  if (lower.includes('speed') || lower.includes('distance') || lower.includes('वेग') || lower.includes('अंतर') || lower.includes('काळ-काम') || lower.includes('time and work') || lower.includes('ट्रेन') || lower.includes('train')) {
    return { subjectKey: 'csat', topicKey: 'speed_time' };
  }
  if (lower.includes('reading comprehension') || lower.includes('comprehension') || lower.includes('उतारा') || lower.includes('गद्यांश')) {
    return { subjectKey: 'csat', topicKey: 'rc' };
  }

  // Environment topics
  if (lower.includes('wildlife') || lower.includes('national park') || lower.includes('वन्यजीव') || lower.includes('राष्ट्रीय उद्यान') || lower.includes('project tiger') || lower.includes('ताडोबा')) {
    return { subjectKey: 'environment', topicKey: 'wildlife' };
  }

  return null;
}

// -------------------------------------------------------------
// AI Model Query Helper (Google Gemini / OpenAI)
// -------------------------------------------------------------
async function queryGeminiAI(message, lang, apiKey) {
  try {
    const key = apiKey || process.env.GEMINI_API_KEY;
    if (!key) return null;

    const langName = lang === 'mr' ? 'Marathi' : lang === 'hi' ? 'Hindi' : 'English';
    const systemPrompt = `You are Abhyas Mitra, a friendly, brilliant, and supportive AI study companion, tutor, and mentor for students and civil service aspirants. Answer the user's question clearly, thoroughly, and helpfully in ${langName}. Use clean markdown, bold headers, and bullet points. Answer any question asked across all subjects (science, history, math, coding, life advice, UPSC/MPSC syllabus, and general topics).`;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          { role: 'user', parts: [{ text: `${systemPrompt}\n\nStudent Question: ${message}` }] }
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1200
        }
      })
    });

    if (res.ok) {
      const data = await res.json();
      const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (reply && reply.trim()) return reply.trim();
    }
  } catch (err) {
    console.warn('[Mitra Gemini] Error:', err.message);
  }
  return null;
}

// -------------------------------------------------------------
// Free Universal AI LLM Engine (Zero-Config, no API key needed)
// -------------------------------------------------------------
async function queryFreeAiLLM(message, lang = 'en', user = null) {
  try {
    const userName = user?.name ? user.name.split(' ')[0] : 'friend';
    const langInstructions = lang === 'mr'
      ? `उत्तर शुद्ध, सुटसुटीत, आदरयुक्त मराठीत द्या. तुम्ही 'अभ्यास मित्र' (Abhyas Mitra) आहात, यूपीएससी आणि एमपीएससी विद्यार्थ्यांचे AI अभ्यास साथीदार. विद्यार्थ्याला '${userName}' म्हणून संबोधित करा. कोणताही विषय असो (आरोग्य, अभ्यास, विज्ञान, इतिहास, चालू घडामोडी, जीवन सल्ला), ChatGPT किंवा Gemini प्रमाणे अत्यंत आत्मीय व उपयुक्त उत्तर द्या:`
      : lang === 'hi'
      ? `उत्तर स्पष्ट, सरल और सम्मानजनक हिंदी में दें। आप 'अभ्यास मित्र' (Abhyas Mitra) हैं, छात्रों के AI स्टडी साथी। छात्र को '${userName}' कहकर संबोधित करें। किसी भी विषय (स्वास्थ्य, पढ़ाई, विज्ञान, इतिहास, करेंट अफेयर्स, जीवन सलाह) पर ChatGPT या Gemini की तरह आत्मीय और सटीक उत्तर दें:`
      : `You are 'Abhyas Mitra', a friendly, compassionate, and expert AI study companion for students. Answer the student (${userName}) warmly, clearly, and helpfully like ChatGPT and Gemini across any topic (health, wellness, study advice, science, history, general knowledge, or daily life):`;

    const fullPrompt = `${langInstructions}\n\nStudent Question: ${message}`;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);

    const url = `https://text.pollinations.ai/${encodeURIComponent(fullPrompt)}?model=openai`;
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { 'User-Agent': 'AbhyasTracker/1.0 (study-companion)' }
    });
    clearTimeout(timeout);

    if (res && res.ok) {
      const text = await res.text();
      if (text && text.trim().length > 25 && !text.includes('Rate limit') && !text.includes('<!DOCTYPE') && !text.includes('Cloudflare')) {
        return text.trim();
      }
    }
  } catch (err) {
    // Falls through to DuckDuckGo / Wikipedia / synthesizer
  }
  return null;
}

// -------------------------------------------------------------
// Universal AI Knowledge & Question-Answering Engine (Answers Everything)
// -------------------------------------------------------------
async function answerUniversalQuestion(query, lang = 'en', user = null) {
  const clean = String(query || '').trim();
  const lower = clean.toLowerCase();

  // 1. Math & Calculation queries
  const mathWords = clean.match(/(?:what is|calculate|solve|find|किती|मान|मूल्य)\s+([\d\s\+\-\*\/\(\)\.\%xX]+)/i);
  const isPureMath = /^[\d\s\+\-\*\/\(\)\.\%\^\=xX]+$/.test(clean);
  if (isPureMath || mathWords) {
    try {
      const rawExpr = (mathWords ? mathWords[1] : clean).replace(/%/g, '*0.01').replace(/x/gi, '*');
      if (/^[\d\s\+\-\*\/\(\)\.]+$/.test(rawExpr)) {
        const result = Function(`'use strict'; return (${rawExpr})`)();
        if (typeof result === 'number' && !isNaN(result)) {
          return {
            text: lang === 'mr'
              ? `🔢 **गणितीय उत्तर:**\n\n\`${clean}\` = **${result}**\n\n💡 *अजून काही हिशोब किंवा सूत्र सोडवायचे असल्यास विचारा!*`
              : lang === 'hi'
              ? `🔢 **गणितीय उत्तर:**\n\n\`${clean}\` = **${result}**\n\n💡 *किसी अन्य गणना या प्रश्न के लिए बेझिझक पूछें!*`
              : `🔢 **Mathematical Calculation:**\n\n\`${clean}\` = **${result}**\n\n💡 *Need help breaking down another equation or math problem? Just ask!*`,
            action: null
          };
        }
      }
    } catch {}
  }

  // 2. Conversational, Jokes & Personal questions
  if (lower.includes('who are you') || lower.includes('what is your name') || lower.includes('तू कोण आहेस') || lower.includes('तुम कौन हो') || lower.includes('who created you')) {
    return {
      text: lang === 'mr'
        ? `🤖 **मी अभ्यास मित्र (Abhyas Mitra) आहे!**\n\nमी तुमचा वैयक्तिक AI अभ्यास साथीदार आहे. मी ChatGPT आणि Gemini प्रमाणे तुमच्या कोणत्याही प्रश्नाचे उत्तर देऊ शकतो—मग तो सिलॅबसचा असो, सामान्य ज्ञानाचा असो, विज्ञानाचा असो, गणिताचा असो किंवा दैनंदिन मार्गदर्शनाचा असो!\n\nतुम्हाला कोणताही प्रश्न पडला तर मला बिनधास्त विचारा!`
        : lang === 'hi'
        ? `🤖 **मैं अभ्यास मित्र (Abhyas Mitra) हूँ!**\n\nमैं आपका व्यक्तिगत AI स्टडी साथी हूँ। मैं ChatGPT और Gemini की तरह आपके किसी भी सवाल का जवाब दे सकता हूँ—चाहे वह सिलेबस से जुड़ा हो, सामान्य ज्ञान, विज्ञान, गणित या जीवन से जुड़ा कोई सवाल हो!\n\nआपको जो भी जानना हो, बेझिझक पूछिए!`
        : `🤖 **I am Abhyas Mitra, your AI Companion!**\n\nThink of me like your personal ChatGPT & Gemini designed for students and learners. I can answer **any question** you have—whether it's syllabus concepts, general knowledge, science, mathematics, coding, history, or daily life advice!\n\nWhat would you like to learn or explore today?`,
      action: null
    };
  }

  if (lower.includes('joke') || lower.includes('विनोद') || lower.includes('चुटकुला')) {
    return {
      text: lang === 'mr'
        ? `😄 **हा घ्या एक विनोदी किस्सा:**\n\nविद्यार्थी: "सर, परीक्षा म्हणजे काय असते?"\nशिक्षक: "जेव्हा दोन तास विचार करूनही आठवत नाही की हे आपण कधी वाचलं होतं, त्याला परीक्षा म्हणतात!" 😂\n\nहसल्याने मन हलके होते. आता पुन्हा उत्साहाने अभ्यासाला लागा!`
        : lang === 'hi'
        ? `😄 **एक मजेदार चुटकुला आपके लिए:**\n\nछात्र: "सर, परीक्षा और प्यार में क्या समानता है?"\nशिक्षक: "दोनों में परिणाम चाहे जो हो, नींद पहले ही उड़ जाती है!" 😂\n\nथोड़ा मुस्कुराइए और फिर नई ऊर्जा के साथ शुरुआत कीजिए!`
        : `😄 **Here's a quick study joke for you:**\n\nStudent: "Why did the textbook look so sad?"\nTeacher: "Because it had too many problems!" 😂\n\nA little smile keeps the brain relaxed. Ready to tackle our next topic?`,
      action: null
    };
  }

  // 2b. Casual Acknowledgements & Courtesy Guard (never look up "ok" in Wikipedia!)
  if (/^(?:ok|okay|okk|k|cool|sure|alright|fine|yes|yeah|yep|got it|understood|done|thx|thanks|thank you|great|awesome|समजले|ठीक आहे|चालेल|हो|धन्यवाद|समझा|ठीक है|जी|शुक्रिया|अच्छा)$/i.test(lower)) {
    return {
      text: lang === 'mr'
        ? `👍 **उत्तम!** जेव्हा तुम्ही तयार असाल, तेव्हा अभ्यासाचा कोणताही प्रश्न किंवा विषय सांगा.`
        : lang === 'hi'
        ? `👍 **बढ़िया!** जब भी आप तैयार हों, पढ़ाई से जुड़ा कोई भी सवाल या टॉपिक पूछें.`
        : `👍 **Sounds great!** Let me know what question or study topic you would like to explore next.`,
      action: null
    };
  }

  // 3. Web Knowledge APIs (DuckDuckGo + Multilingual Wikipedia)
  try {
    const wikiPrefix = lang === 'mr' ? 'mr' : lang === 'hi' ? 'hi' : 'en';

    const strippedQuery = clean
      .replace(/^(?:who\s+(?:is|was|are)|what\s+(?:is|was|are|does)|how\s+(?:does|do|to|is)|tell\s+me\s+about|explain|describe|give\s+me\s+info\s+on|कोण\s+आहे|काय\s+आहे|म्हणजे\s+काय|कोण\s+होते|कौन\s+हैं|क्या\s+है|बताइए|समझाएं)\s+/i, '')
      .replace(/^(?:the|a|an)\s+/i, '')
      .replace(/[?.,!]/g, '')
      .trim() || clean;

    // Helper for resilient JSON fetching without crashing on empty/non-JSON responses
    const safeFetchJson = async (url, options = {}) => {
      try {
        const res = await fetch(url, {
          ...options,
          headers: {
            'User-Agent': 'AbhyasTracker/1.0 (contact: support@abhyastracker.local)',
            ...(options.headers || {})
          }
        });
        if (!res || !res.ok) return null;
        const text = await res.text();
        if (!text || !text.trim()) return null;
        return JSON.parse(text);
      } catch {
        return null;
      }
    };

    // A) DuckDuckGo Instant Answer
    const ddgUrl = `https://api.duckduckgo.com/?q=${encodeURIComponent(strippedQuery)}&format=json&no_html=1&skip_disambig=1`;
    const ddgData = await safeFetchJson(ddgUrl);
    if (ddgData && ddgData.AbstractText && ddgData.AbstractText.length > 50) {
      const title = ddgData.Heading || strippedQuery;
      return {
        text: `📚 **${title}**\n\n${ddgData.AbstractText}\n\n${ddgData.AbstractSource ? `📖 *Source: ${ddgData.AbstractSource}*` : ''}\n\n💡 *Do you want more details, practice questions, or an exam summary on this?*`,
        action: null
      };
    }

    // B) Wikipedia Direct Summary in selected language
    const wikiUrl = `https://${wikiPrefix}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(strippedQuery)}`;
    const wikiData = await safeFetchJson(wikiUrl);
    if (wikiData && wikiData.extract && wikiData.extract.length > 30) {
      return {
        text: `📖 **${wikiData.title}**\n\n${wikiData.extract}\n\n💡 *Would you like me to explain this in simpler terms (ELI10), give key highlights, or connect it to your syllabus?*`,
        action: null
      };
    }

    // C) Wikipedia Search if direct title not matched
    const searchUrl = `https://${wikiPrefix}.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(strippedQuery)}&format=json`;
    const searchData = await safeFetchJson(searchUrl);
    const firstHit = searchData?.query?.search?.[0];
    if (firstHit && firstHit.title) {
      const subSumUrl = `https://${wikiPrefix}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(firstHit.title)}`;
      const subData = await safeFetchJson(subSumUrl);
      if (subData && subData.extract && subData.extract.length > 30) {
        return {
          text: `📖 **${subData.title}**\n\n${subData.extract}\n\n💡 *Do you want to explore more about this topic or need study notes?*`,
          action: null
        };
      }
    }

    // D) English Wikipedia fallback if regional language wiki had no match
    if (wikiPrefix !== 'en') {
      const enUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(clean)}`;
      const enData = await safeFetchJson(enUrl);
      if (enData && enData.extract && enData.extract.length > 30) {
        return {
          text: `📖 **${enData.title}**\n\n${enData.extract}\n\n💡 *I found this overview. Would you like me to translate it or simplify it for you?*`,
          action: null
        };
      }
    }
  } catch (err) {
    console.warn('[Universal Knowledge] Fetch notice:', err.message);
  }

  // 4. Conversational Synthesizer (helpful guidance without rigid template)
  if (lang === 'mr') {
    return {
      text: `💡 **अभ्यास मित्राचा सल्ला:**\n\nतुमच्या *" ${clean} "* या प्रश्नाबाबत:\n\n• **मुख्य दृष्टीकोन:** स्पर्धा परीक्षेच्या प्रवासात प्रत्येक विषयाची संकल्पना, कारणे आणि व्यावहारिक उपयोग समजून घेणे सर्वात महत्त्वाचे ठरते.\n• **पुढील पाऊल:** जर तुम्हाला याबद्दल सविस्तर स्पष्टीकरण, परीक्षाभिमुख नोट्स किंवा सोप्या भाषेत (ELI10) माहिती हवी असेल तर मला नक्की विचारा!`,
      action: null
    };
  }

  if (lang === 'hi') {
    return {
      text: `💡 **अभ्यास मित्र का सुझाव:**\n\nआपने *" ${clean} "* के संदर्भ में पूछा है.\n\n• **मुख्य दृष्टिकोण:** किसी भी विषय की बेहतर तैयारी के लिए उसके मूलभूत सिद्धांतों और व्यावहारिक महत्व को समझना जरूरी है.\n• **अगला कदम:** क्या आप इसके बारे में विस्तृत नोट्स, आसान भाषा में व्याख्या (ELI10) या अभ्यास प्रश्न चाहते हैं? बेझिझक बताइए!`,
      action: null
    };
  }

  return {
    text: `💡 **Abhyas Mitra Guidance:**\n\nRegarding your question on **"${clean}"**:\n\n• **Core Perspective:** Every concept or situation is best approached by understanding its key principles, practical context, and breaking it down into manageable parts.\n• **Next Step:** Would you like a simpler breakdown (ELI10), key exam highlights, or specific practice tips on this? Just let me know!`,
    action: null
  };
}

// -------------------------------------------------------------
// Engine Process Function (Async, Universal AI Powered)
// -------------------------------------------------------------
async function processMitraMessage(arg1, arg2 = 'en', arg3 = {}, arg4 = null, arg5 = null) {
  let message, lang, user, geminiKey, sessions, plans, topicProgress;
  if (arg1 && typeof arg1 === 'object' && !Array.isArray(arg1) && (arg1.message !== undefined || arg1.lang !== undefined)) {
    ({ message = '', lang = 'en', user = null, geminiKey = null, sessions = [], plans = [], topicProgress = [] } = arg1);
  } else {
    message = arg1 || '';
    lang = arg2 || 'en';
    const stats = arg3 || {};
    user = arg4 || null;
    geminiKey = arg5 || null;
    sessions = stats.sessions || [];
    plans = stats.plans || [];
    topicProgress = stats.topicProgress || [];
  }

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
        : `😴 **Feeling Tired? That's completely normal!**\n\nDon't force heavy theoretical concepts right now. Drink a glass of water, take a short rest break, do a quick 5-minute stretch, and switch to lighter tasks like MCQs, PYQs, or audio editorials. Even 20 mins beats 0 mins!`,
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

  // 1b-ii. Feeling Unwell / Sick / Low Energy / "Not feeling well to study"
  const isUnwell = /(?:not\s+feeling\s+well|feeling\s+unwell|feeling\s+sick|not\s+well|unwell|sick|headache|fever|body\s*ache|stomach\s*ache|ill|don'?t\s+feel\s+like\s+study|dont\s+feel\s+like\s+study|not\s+feeling\s+like\s+study|not\s+in\s+(?:the\s+)?mood|no\s+mood|can'?t\s+study\s+today|cant\s+study\s+today|cannot\s+study\s+today|तबीयत|तब्येत|बरा\s+वाटत\s+नाही|बरी\s+नाही|मन\s+लागत\s+नाही|मन\s+नहीं\s+कर\s+रहा|बीमार|डोके\s*दुखी|सिर\s*दर्द)/i.test(cleanMsg);

  if (isUnwell) {
    if (selectedLang === 'mr') {
      return {
        text: `🩺 **आरोग्य प्रथम! कृपया स्वतःवर जबरदस्ती करू नका.** ❤️\n\nमी समजू शकतो. स्पर्धा परीक्षेचा प्रवास मोठा आहे आणि शरीराला किंवा मनाला अस्वस्थता जाणवणे अत्यंत साहजिक आहे. तब्येत बरी नसताना जबरदस्तीने वाचल्यास काहीही लक्षात राहत नाही आणि पुढे जास्त दिवस वाया जातात.\n\n**आत्ता काय करावे?**\n\n१. 🛌 **पुस्तके बाजूला ठेवा आणि विश्रांती घ्या:**\n   गरम पाणी किंवा सूप प्या, डोळे मिटून पडून राहा. शरीराला बरे होण्यासाठी विश्रांतीची गरज आहे.\n\n२. 🎧 **हलका अभ्यास (फक्त इच्छा असल्यास):**\n   • कठीण विषय (उदा. राज्यघटना किंवा CSAT गणित) अजिबात हाताळू नका.\n   • झोपून झोपून १०-१५ मिनिटांचे दैनिक चालू घडामोडींचे ऑडिओ किंवा संपादकीय विश्लेषण ऐका.\n\n३. 🌿 **अपराधी भावना मनात आणू नका:**\n   तब्येत ठीक नसताना विश्रांती घेणे हाही अभ्यासाच्या नियोजनाचाच एक महत्त्वाचा भाग आहे. सर्व टॉपर्स विश्रांती घेतात.\n\n४. 💤 **शांत झोप घ्या:**\n   उद्या ताजेतवाने उठल्यावर आपण नवीन उत्साहाने सुरुवात करू!\n\nकाळजी घ्या, मित्रा! 💙`,
        action: 'relax_exercise',
        suggestedActionLabel: '🛌 विश्रांती घ्या',
        quickReplies: [
          '🛌 मी आज विश्रांती घेतो',
          '🎧 ऑडिओ चालू घडामोडी',
          '▶ १५ मिनिटे हलका सराव'
        ]
      };
    } else if (selectedLang === 'hi') {
      return {
        text: `🩺 **सेहत सबसे पहले! कृपया खुद पर ज्यादा दबाव न डालें।** ❤️\n\nतबीयत ठीक न होना या पढ़ाई का मन न होना बिल्कुल स्वाभाविक है। अस्वस्थ मन या शरीर से जबरदस्ती पढ़ने पर पढ़ा हुआ याद नहीं रहता और आगे कई दिन खराब हो सकते हैं।\n\n**अभी आपको क्या करना चाहिए?**\n\n1. 🛌 **किताबें बंद करके आराम करें:**\n   गुनगुना पानी या चाय पिएं, आंखों को आराम दें और लेट जाएं। सेहत सही रहेगी तो पढ़ाई कल भी हो सकती है।\n\n2. 🎧 **हल्का-फुल्का रिवीजन (यदि आपका मन करे तो):**\n   • कोई कठिन या भारी विषय (पॉलिटी/इकोनॉमी) न उठाएं।\n   • लेटकर 10-15 मिनट का करेंट अफेयर्स का ऑडियो या पॉडकास्ट सुन सकते हैं।\n\n3. 🌿 **दोष महसूस न करें:**\n   बीमार होने पर आराम करना कमजोरी नहीं, बल्कि समझदारी है। हर टॉपर ऐसा करता है।\n\n4. 💤 **पूरी नींद लें:**\n   कल जब आप बेहतर महसूस करेंगे, तब हम एक नए 20 मिनट के फोकस ब्लॉक से शुरुआत करेंगे!\n\nअपना ध्यान रखें! 💙`,
        action: 'relax_exercise',
        suggestedActionLabel: '🛌 आराम करें',
        quickReplies: [
          '🛌 मैं आज आराम करूंगा',
          '🎧 ऑडियो करेंट अफेयर्स',
          '▶ 15 मिनट हल्का अभ्यास'
        ]
      };
    }
    return {
      text: `🩺 **Health Always Comes First! Please Don't Force Yourself.** ❤️\n\nI hear you, and it's completely okay. Preparing for competitive exams is a marathon, not a sprint. Pushing yourself through sickness, headache, or exhaustion will only drain you further and risk losing days of study.\n\nHere is what you should do right now:\n\n1. 🛌 **Step Away from Heavy Books:**\n   Close the thick reference books. Lie down, drink a glass of warm water or tea, and let your body rest. Physical recovery is productive!\n\n2. 🎧 **Zero-Pressure "Study-Lite" (Only if you truly want to):**\n   • Don't touch heavy theory or complex problem-solving (like Laxmikanth or CSAT math).\n   • While lying down, you can listen to a 10–15 minute daily news editorial or podcast with your eyes closed.\n   • Or just do nothing and let your brain recharge.\n\n3. 🌿 **Release Any Guilt:**\n   Resting when unwell is an essential part of staying consistent in the long run. Every single ranker takes rest days when sick.\n\n4. 💤 **Sleep & Reassess Tomorrow:**\n   Get solid sleep tonight. Once you feel better tomorrow, we'll kick off with an easy 20-minute focus session.\n\nTake care of yourself first, friend! Your well-being matters most. 💙`,
      action: 'relax_exercise',
      suggestedActionLabel: '🛌 Take Rest Break',
      quickReplies: [
        '🛌 I will take rest today',
        '🎧 Listen to Audio Editorial',
        '▶ 15m Gentle Sprint'
      ]
    };
  }

  // 1b-iii. Casual Acknowledgements & Courtesy ("ok", "okay", "sure", "thanks", "got it", etc.)
  // Prevents casual small talk from triggering Wikipedia article lookups (e.g. Wikipedia "OK")
  const isAck = /^(?:ok|okay|okk|k|cool|sure|alright|fine|yes|yeah|yep|got it|understood|done|thx|thanks|thank you|great|awesome|समजले|ठीक आहे|चालेल|हो|धन्यवाद|समझा|ठीक है|जी|शुक्रिया|अच्छा)(?:[.! ]*)$/i.test(cleanMsg) ||
    (/^\b(?:ok|okay|okk|k|cool|sure|alright|fine|yes|yeah|yep|got it|understood|done|thx|thanks|thank you|great|awesome)\b/i.test(cleanMsg) && cleanMsg.split(/\s+/).length <= 3);

  if (isAck) {
    if (selectedLang === 'mr') {
      return {
        text: `👍 **उत्तम! मी तुमच्या सोबत आहे.**\n\nजेव्हा तुम्ही तयार असाल, तेव्हा आपण पुढे काय करायचे? खालील पर्यायावर टॅप करा किंवा कोणताही प्रश्न विचारा:`,
        action: null,
        quickReplies: [
          '🔁 विषयांची उजळणी',
          '📅 आजचे नियोजन',
          '⏱️ २५ मिनिटे फोकस टायमर',
          '💡 संकल्पना स्पष्ट करा',
          '🧠 सराव प्रश्न'
        ]
      };
    } else if (selectedLang === 'hi') {
      return {
        text: `👍 **बढ़िया! मैं आपके साथ हूँ।**\n\nजब भी आप तैयार हों, बताइए आगे क्या करना है? नीचे दिए गए विकल्प चुनें या कोई भी सवाल पूछें:`,
        action: null,
        quickReplies: [
          '🔁 विषय रिवीजन',
          '📅 आज का स्टडी प्लान',
          '⏱️ 25 मिनट फोकस टाइमर',
          '💡 कॉन्सेप्ट समझें',
          '🧠 क्विक क्विज'
        ]
      };
    }
    return {
      text: `👍 **Great! I'm right here with you.**\n\nWhenever you're ready, what would you like to do next? Choose an option below or ask me any question:`,
      action: null,
      quickReplies: [
        '🔁 Subject Revision',
        '📅 Plan Today\'s Study',
        '⏱️ 25m Focus Timer',
        '💡 Explain a Concept',
        '🧠 Quick Quiz'
      ]
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

  // 1e. Revision Reminder & Spaced Repetition (3-Tier Interactive Subject & Topic Navigation)
  const isSwitchSubject = cleanMsg.includes('switch subject') || cleanMsg.includes('choose another subject') || cleanMsg.includes('दुसरा विषय') || cleanMsg.includes('दूसरा विषय') || cleanMsg.includes('विषय बदला') || cleanMsg.includes('विषय बदलें');
  const isRevisionKeyword = cleanMsg.includes('revision') || cleanMsg.includes('रिव्हिजन') || cleanMsg.includes('उजळणी') || cleanMsg.includes('रिवीजन') || cleanMsg.includes('revise') || cleanMsg.includes('spaced repetition');

  // Check if student clicked or typed a specific revision topic
  const detectedTopic = detectRevisionTopic(cleanMsg);
  if (detectedTopic) {
    return buildTopicRevisionCard({ subjectKey: detectedTopic.subjectKey, topicKey: detectedTopic.topicKey, selectedLang });
  }

  // Check if student clicked or typed a specific revision subject
  const detectedSubject = detectRevisionSubject(cleanMsg);
  if (detectedSubject && (isRevisionKeyword || cleanMsg.includes('📖') || cleanMsg.includes('🏛️') || cleanMsg.includes('🌍') || cleanMsg.includes('📈') || cleanMsg.includes('📐') || cleanMsg.includes('🌿') || cleanMsg.includes('more') || cleanMsg.includes('इतर') || cleanMsg.includes('अन्य') || cleanMsg.split(/\s+/).length <= 4)) {
    return buildTopicRevisionMenu({ subjectKey: detectedSubject, selectedLang });
  }

  if (isRevisionKeyword || isSwitchSubject) {
    return buildSubjectRevisionMenu({ selectedLang });
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

  // 4. Study Planning & Meta AI Conversational Helper
  const hasHoursOrTime = /\b(\d+(?:\.\d+)?)\s*(?:hours?|hrs?|hr|तास|घंटे|घंटा)\b/i.test(cleanMsg) ||
    ['10 hours', '8 hours', '6 hours', '4 hours', '3 hours', '2 hours', '१० तास', '८ तास', '६ तास', '४ तास', '10 घंटे', '8 घंटे', '6 घंटे', '4 घंटे', 'working aspirant', 'job + study', 'नोकरी + अभ्यास', 'जॉब + पढ़ाई', 'adjust', 'बदला'].some(k => cleanMsg.includes(k));

  const isPlan = PLAN_KEYWORDS.some(k => cleanMsg.includes(k.toLowerCase())) ||
    (hasHoursOrTime && (cleanMsg.includes('mpsc') || cleanMsg.includes('upsc') || cleanMsg.includes('polity') || cleanMsg.includes('history') || cleanMsg.includes('geography') || cleanMsg.includes('csat') || cleanMsg.includes('economy') || cleanMsg.includes('राज्यघटना') || cleanMsg.includes('इतिहास') || cleanMsg.includes('भूगोल') || cleanMsg.includes('अभ्यास') || cleanMsg.includes('पढ़ाई') || cleanMsg.includes('working') || cleanMsg.includes('job') || cleanMsg.includes('aspirant') || cleanMsg.includes('नोकरी')));

  if (isPlan) {
    const hasSpecificParameters = checkHasStudyParameters(cleanMsg);
    if (!hasSpecificParameters) {
      return buildMetaAiStudyPlanInquiry({ selectedLang, user });
    }
    return buildStudentCustomizedPlan({ cleanMsg, selectedLang, user, sessions, plans });
  }

  // 5. Focus & Pomodoro
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
  const isGreeting = /\b(?:hi|hello|hey|namaste|नमस्कार|नमस्ते)\b/i.test(cleanMsg) && cleanMsg.split(/\s+/).length <= 4;
  if (isGreeting) {
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

  // 10. Universal AI Question Answering (Answers EVERYTHING like ChatGPT & Gemini!)
  // Priority 1: If Google Gemini API Key is provided via request, env or settings
  const activeGeminiKey = geminiKey || process.env.GEMINI_API_KEY;
  if (activeGeminiKey) {
    const aiAnswer = await queryGeminiAI(message, selectedLang, activeGeminiKey, user);
    if (aiAnswer && aiAnswer.trim()) {
      return {
        text: aiAnswer,
        action: null
      };
    }
  }

  // Priority 2: Free Universal AI LLM Engine (Pollinations OpenAI model - zero config)
  try {
    const freeAiAnswer = await queryFreeAiLLM(message, selectedLang, user);
    if (freeAiAnswer && freeAiAnswer.trim()) {
      return {
        text: freeAiAnswer,
        action: null
      };
    }
  } catch {}

  // Priority 3: Universal Knowledge & Synthesis Engine (DuckDuckGo + Wikipedia + Math + Conversational AI)
  const universalAnswer = await answerUniversalQuestion(message, selectedLang, user);
  return universalAnswer;
}

module.exports = {
  processMitraMessage,
  KNOWLEDGE_BASE,
  QUIZZES
};
