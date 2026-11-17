import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  Alert,
  Platform,
  ActivityIndicator,
  useWindowDimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Defs, LinearGradient, Stop, Path, Rect } from 'react-native-svg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getTranslation } from './translations';
import { req } from './api';

export default function ProSubscriptionScreen({
  user,
  theme,
  isDarkMode,
  lang = 'mr',
  t: customT,
  onSelectTab,
  onUpdateUser
}) {
  const { width: windowWidth } = useWindowDimensions();
  const isWide = windowWidth >= 768; // Desktop, tablet or wide browser view

  const t = (k, fb) => (customT ? customT(k, fb) : getTranslation(k, lang, fb));
  const isDark = Boolean(isDarkMode);

  // Active Subscription State
  const [isPremiumActive, setIsPremiumActive] = useState(
    user?.subscriptionTier === 'pro' ||
      user?.subscriptionTier === 'premium' ||
      Boolean(user?.subscriptionExpiresAt)
  );
  const [activePlanName, setActivePlanName] = useState(
    user?.subscriptionPlan || 'Premium Officer All-Access'
  );
  const [expiryDate, setExpiryDate] = useState(user?.subscriptionExpiresAt || null);

  // Selected Plan for checkout: 'premium' ($29.99), 'standard' ($19.99), 'basic' ($9.99)
  const [selectedPlanId, setSelectedPlanId] = useState('premium');

  // Modals & Sheets
  const [checkoutModalVisible, setCheckoutModalVisible] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [manageModalVisible, setManageModalVisible] = useState(false);
  const [termsModalVisible, setTermsModalVisible] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState(null);

  // Theme Colors - Consistent with Abhyas Tracker Identity
  const colors = {
    bg: theme?.bg || (isDark ? '#0F172A' : '#F4F7FA'),
    cardBg: theme?.cardBg || (isDark ? '#1E293B' : '#FFFFFF'),
    text: theme?.text || (isDark ? '#E2E8F0' : '#1E293B'),
    muted: theme?.muted || (isDark ? '#94A3B8' : '#64748B'),
    border: theme?.border || (isDark ? '#334155' : '#E2E8F0'),
    blue: '#1E40AF',
    teal: theme?.blue || '#247C78',
    green: '#10B981',
    gold: '#D97706',
    goldBg: isDark ? '#3B2F15' : '#FEF3C7'
  };

  // Restore cached subscription
  useEffect(() => {
    (async () => {
      try {
        const storedSub = await AsyncStorage.getItem('@abhyas_pro_subscription');
        if (storedSub) {
          const parsed = JSON.parse(storedSub);
          if (parsed?.expiresAt && new Date(parsed.expiresAt).getTime() > Date.now()) {
            setIsPremiumActive(true);
            setActivePlanName(parsed.planName || 'Premium Officer All-Access');
            setExpiryDate(parsed.expiresAtFormatted || parsed.expiresAt);
          }
        }
      } catch {}
    })();
  }, []);

  // Sync on user prop update
  useEffect(() => {
    if (user?.subscriptionTier === 'pro' || user?.subscriptionTier === 'premium') {
      setIsPremiumActive(true);
      setActivePlanName(user?.subscriptionPlan || activePlanName);
      setExpiryDate(user?.subscriptionExpiresAt || expiryDate);
    }
  }, [user]);

  // Plans Definitions Tailored for Abhyas Tracker (UPSC & MPSC Features)
  const plans = {
    basic: {
      id: 'basic',
      title: lang === 'mr' ? 'बेसिक अभ्यास पास' : 'Basic Monthly Pass',
      category: 'BASIC',
      basePrice: 9.99,
      priceLabel: '$9.99',
      durationLabel: lang === 'mr' ? '/महिना' : '/month',
      periodMonths: 1,
      periodDesc: lang === 'mr' ? '१ महिना लवचिक अभ्यास कालावधी' : '1 Month Starter Billing',
      features: [
        lang === 'mr' ? 'अभ्यास टायमर आणि पोमोडोरो स्टॉपवॉच' : 'Study timer & Pomodoro stopwatch',
        lang === 'mr' ? 'UPSC व MPSC अभ्यासक्रम चेकलिस्ट' : 'UPSC & MPSC syllabus checklist',
        lang === 'mr' ? 'दैनिक अभ्यास ध्येय आणि टास्क प्लॅनर' : 'Daily study goals & planner',
        lang === 'mr' ? '३०-दिवसीय सातत्य व अभ्यास विश्लेषण' : '30-Day study streak & analytics',
        lang === 'mr' ? 'AI अभ्यास मित्र (२० शंका / दिवस)' : 'AI Abhyas Mitra (20 doubts / day)',
        lang === 'mr' ? 'मूलभूत अभ्यास सूचना व स्मरणपत्रे' : 'Basic reminder notifications'
      ]
    },
    premium: {
      id: 'premium',
      title: lang === 'mr' ? 'प्रीमियम अधिकारी वार्षिक ऑल-एक्सेस' : 'Premium Officer All-Access',
      category: 'PREMIUM',
      basePrice: 29.99,
      originalPrice: 119.99,
      priceLabel: '$29.99',
      durationLabel: lang === 'mr' ? '/वर्ष' : '/year',
      periodMonths: 12,
      tag: '★ BEST VALUE – SAVE 75%',
      periodDesc: lang === 'mr' ? '१२ महिने अमर्याद ऑल-एक्सेस पास' : '12 Months Annual All-Access',
      features: [
        lang === 'mr' ? 'स्टँडर्ड व बेसिक मधील सर्व सुविधा' : 'Everything in Standard & Basic PLUS:',
        lang === 'mr' ? 'अमर्याद २४/७ AI अभ्यास मित्र मार्गदर्शक' : 'Unlimited 24/7 AI Abhyas Mitra mentor',
        lang === 'mr' ? 'AI मुख्य परीक्षा उत्तर तपासणी व गुणदान' : 'AI GS Mains Answer Evaluation & rubric',
        lang === 'mr' ? '२५+ वर्षे सोडवलेले पूर्व व मुख्य PYQ संच' : '25+ Years solved Prelims & Mains PYQs',
        lang === 'mr' ? 'सर्व विषयांचे हाय-डेफिनिशन ऑफलाइन माइंडमॅप्स' : 'High-res offline Mindmaps & PDFs',
        lang === 'mr' ? 'वार्षिक कामगिरी अहवाल व प्रगती हीटमॅप' : 'Annual performance reports & heatmaps',
        lang === 'mr' ? 'सखोल एकाग्रता झेन ऑडिओ व बीट्स' : 'Zen focus binaural study beats',
        lang === 'mr' ? 'प्राधान्य व्हीआयपी तिकीट मदत (< २ तास)' : 'Priority VIP Mentor Helpdesk (< 2 hrs)'
      ]
    },
    standard: {
      id: 'standard',
      title: lang === 'mr' ? 'स्टँडर्ड ६-महिने बूस्टर पास' : 'Standard 6-Month Sprint',
      category: 'STANDARD',
      basePrice: 19.99,
      priceLabel: '$19.99',
      durationLabel: lang === 'mr' ? '/६ महिने' : '/6 months',
      periodMonths: 6,
      periodDesc: lang === 'mr' ? '६ महिने प्रगत अभ्यास तयारी' : '6 Months Preparation Sprint',
      features: [
        lang === 'mr' ? 'अमर्याद अभ्यास सत्र इतिहास नोंदणी' : 'Unlimited study session history',
        lang === 'mr' ? 'प्रगत साप्ताहिक व मासिक विश्लेषण' : 'Advanced weekly & monthly analytics',
        lang === 'mr' ? 'दैनिक व साप्ताहिक सानुकूल अभ्यास ध्येय' : 'Custom daily & weekly study targets',
        lang === 'mr' ? 'स्मार्ट अभ्यास नियोजक व वेळापत्रक' : 'Smart study planner & routines',
        lang === 'mr' ? 'AI अभ्यास मित्र मार्गदर्शन (६० शंका/दिवस)' : 'AI Abhyas Mitra (60 doubts / day)',
        lang === 'mr' ? 'क्लाउड बॅकअप व मल्टी-डिव्हाइस सिंक' : 'Cloud backup & multi-device sync',
        lang === 'mr' ? 'अभ्यास अहवाल पीडीएफ डाउनलोड' : 'Downloadable PDF study reports'
      ]
    }
  };

  const selectedPlan = plans[selectedPlanId] || plans.premium;

  // Open Checkout for a specific plan
  const handleSelectPlanAndCheckout = (planId) => {
    if (planId === 'free') {
      Alert.alert(
        lang === 'mr' ? 'मोफत विद्यार्थी खाते' : 'Basic Aspirant Free Tier',
        lang === 'mr'
          ? 'आपण आधीच मूलभूत मोफत ट्रॅकिंग वापरत आहात! सर्व प्रगत सुविधांसाठी बेसिक, स्टँडर्ड किंवा प्रीमियम पास निवडा.'
          : 'You are currently enjoying the Free Plan! Select Basic, Standard, or Premium Officer to unlock all advanced tools.'
      );
      return;
    }
    setSelectedPlanId(planId);
    setCheckoutModalVisible(true);
  };

  // Confirm and Activate Subscription
  const handleConfirmPayment = async () => {
    setPaymentProcessing(true);

    try {
      const expDate = new Date();
      expDate.setMonth(expDate.getMonth() + selectedPlan.periodMonths);
      const expiryIso = expDate.toISOString();
      const expiryFormatted = expDate.toLocaleDateString(
        lang === 'mr' ? 'mr-IN' : 'en-IN',
        { day: 'numeric', month: 'short', year: 'numeric' }
      );

      const record = {
        tier: selectedPlan.category.toLowerCase(),
        planId: selectedPlan.id,
        planName: selectedPlan.title,
        amountPaid: selectedPlan.basePrice,
        currency: 'USD',
        subscribedAt: new Date().toISOString(),
        expiresAt: expiryIso,
        expiresAtFormatted: expiryFormatted
      };

      await AsyncStorage.setItem('@abhyas_pro_subscription', JSON.stringify(record));

      // Sync with backend if available
      try {
        if (req) {
          await req('/me', 'PATCH', {
            subscriptionTier: 'premium',
            subscriptionPlan: selectedPlan.title,
            subscriptionExpiresAt: expiryFormatted
          });
        }
      } catch (err) {
        console.log('Saved locally:', err?.message);
      }

      setIsPremiumActive(true);
      setActivePlanName(selectedPlan.title);
      setExpiryDate(expiryFormatted);

      if (onUpdateUser) {
        onUpdateUser({
          subscriptionTier: 'premium',
          subscriptionPlan: selectedPlan.title,
          subscriptionExpiresAt: expiryFormatted
        });
      }

      setPaymentProcessing(false);
      setCheckoutModalVisible(false);
      setSuccessModalVisible(true);
    } catch (e) {
      setPaymentProcessing(false);
      Alert.alert(
        lang === 'mr' ? 'त्रुटी' : 'Error',
        lang === 'mr' ? 'पेमेंट प्रक्रिया पूर्ण करता आली नाही. कृपया पुन्हा प्रयत्न करा.' : 'Payment failed. Please try again.'
      );
    }
  };

  // Restore Purchases
  const handleRestorePurchases = async () => {
    try {
      const stored = await AsyncStorage.getItem('@abhyas_pro_subscription');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed?.expiresAt && new Date(parsed.expiresAt).getTime() > Date.now()) {
          setIsPremiumActive(true);
          setActivePlanName(parsed.planName || 'Premium Officer All-Access');
          setExpiryDate(parsed.expiresAtFormatted || parsed.expiresAt);
          Alert.alert(
            lang === 'mr' ? 'खरेदी पूर्ववत झाली' : 'Purchases Restored',
            t('purchasesRestored', 'Purchases restored successfully. Your subscription is up to date.')
          );
          return;
        }
      }
      Alert.alert(
        lang === 'mr' ? 'माहिती' : 'Info',
        lang === 'mr'
          ? 'कोणतेही सक्रिय सबस्क्रिप्शन आढळले नाही. आपण नवीन सबस्क्रिप्शन सुरू करू शकता.'
          : 'No active subscription found for this account.'
      );
    } catch {
      Alert.alert(
        lang === 'mr' ? 'त्रुटी' : 'Error',
        lang === 'mr' ? 'खरेदी तपासता आली नाही.' : 'Could not restore purchases.'
      );
    }
  };

  // Cancel Subscription Flow
  const handleCancelSubscription = () => {
    Alert.alert(
      t('cancelConfirmTitle', 'Cancel Subscription?'),
      t(
        'cancelConfirmDesc',
        'You will continue to have Premium access until the end of your current billing period ({date}).'
      ).replace('{date}', expiryDate || 'end of period'),
      [
        { text: t('keepSubscription', 'Keep My Subscription'), style: 'cancel' },
        {
          text: t('confirmCancel', 'Confirm Cancellation'),
          style: 'destructive',
          onPress: async () => {
            setManageModalVisible(false);
            Alert.alert(
              lang === 'mr' ? 'सबस्क्रिप्शन रद्द केले' : 'Subscription Cancelled',
              lang === 'mr'
                ? `स्वयंचलित नूतनीकरण बंद करण्यात आले आहे. आपण ${expiryDate || 'कालावधी संपण्यापर्यंत'} सर्व प्रीमियम सुविधा वापरू शकता.`
                : `Auto-renewal has been turned off. You retain Premium benefits until ${expiryDate || 'period ends'}.`
            );
          }
        }
      ]
    );
  };

  // FAQs List
  const faqs = [
    {
      q: lang === 'mr' ? 'अभ्यास प्रीमियम मध्ये UPSC आणि MPSC दोन्ही समाविष्ट आहे का?' : 'Does Premium cover both UPSC and MPSC?',
      a: lang === 'mr'
        ? 'होय! प्रीमियम मध्ये युपीएससी नागरी सेवा व एमपीएससी राज्यसेवा/कंबाइन या दोन्ही परीक्षांचे सविस्तर अभ्यासक्रम, २५+ वर्षांचे प्रश्नसंच, आणि AI अभ्यास मित्र मार्गदर्शन उपलब्ध आहे.'
        : 'Yes! Complete syllabus tracking, 25+ years question banks, and AI mentorship for both UPSC and MPSC civil services examinations are included.'
    },
    {
      q: lang === 'mr' ? 'AI मुख्य परीक्षा उत्तर तपासणी कशी कार्य करते?' : 'How does AI Mains Answer Evaluation work?',
      a: lang === 'mr'
        ? 'अभ्यास मित्र तुमच्या उत्तरांचे अधिकृत आयोगाच्या निकषांनुसार (प्रस्तावना-मुख्य भाग-निष्कर्ष, घटनात्मक कलमे, अचूक संदर्भ) विश्लेषण करून गुणदान व सुधारणा सूचना देतो.'
        : 'Abhyas Mitra evaluates handwritten and typed answers according to official UPSC/MPSC rubric standards: structure, constitutional articles, keywords, and marks allocation.'
    },
    {
      q: lang === 'mr' ? 'मी इंटरनेटशिवाय ऑफलाइन अभ्यास करू शकतो का?' : 'Can I use basic tracking features offline?',
      a: lang === 'mr'
        ? 'होय! मूलभूत अभ्यास टायमर, ऑफलाइन तास नोंदणी व अभ्यासक्रम चेकलिस्ट इंटरनेट नसताना १००% कार्य करतात. प्रीमियम मधील नोट्सही ऑफलाइन डाउनलोड करता येतात.'
        : 'Yes! Core study timer, manual hour logging, and checklist operate 100% offline. Premium revision mindmaps can also be downloaded for offline viewing.'
    },
    {
      q: lang === 'mr' ? 'मी सबस्क्रिप्शन कधीही रद्द करू शकतो का?' : 'Can I cancel anytime?',
      a: lang === 'mr'
        ? 'होय! कोणतेही बंधन नाही. तुम्ही कधीही एका क्लिकवर ॲपमधून किंवा गुगल प्ले स्टोअरमधून सबस्क्रिप्शन रद्द करू शकता.'
        : 'Yes! You can cancel anytime directly from the app or Google Play Store. You will retain access until the end of your billing cycle.'
    }
  ];

  // ================= CARD BUILDERS (RESPONSIVE FOR WHOLE SPACE) =================
  const renderBasicCard = (wide) => (
    <View
      key="basic"
      style={[
        wide ? styles.refCardWide : styles.refCardMobile,
        { borderColor: colors.border }
      ]}
    >
      {/* Top White Half */}
      <View style={styles.refCardTopWhite}>
        <Text style={styles.refCardCategoryBasic}>BASIC</Text>
        <Text style={styles.refCardPriceText}>$9.99</Text>
        <Text style={styles.refCardDurationText}>
          {lang === 'mr' ? 'दरमहा लवचिक बिलिंग' : '/ month'}
        </Text>
      </View>

      {/* Bottom Purple-to-Cyan Gradient Container */}
      <View style={styles.refCardBottomContainer}>
        {/* SVG Slanted Cut (100% Responsive) */}
        <Svg
          width="100%"
          height="100%"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          style={StyleSheet.absoluteFillObject}
        >
          <Defs>
            <LinearGradient id="basicGrad" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0%" stopColor="#7C3AED" />
              <Stop offset="50%" stopColor="#9333EA" />
              <Stop offset="100%" stopColor="#06B6D4" />
            </LinearGradient>
          </Defs>
          <Path
            d="M 0 0 L 100 8 L 100 100 L 0 100 Z"
            fill="url(#basicGrad)"
          />
        </Svg>

        <View style={styles.refFeaturesList}>
          {plans.basic.features.map((feat, idx) => (
            <View key={idx} style={styles.refFeatureItemRow}>
              <Ionicons name="checkmark-sharp" size={14} color="#FBCFE8" style={styles.refCheckIcon} />
              <Text style={styles.refFeatureTextWhite} numberOfLines={2}>
                {feat}
              </Text>
            </View>
          ))}
        </View>

        <TouchableOpacity
          style={styles.refBasicBuyBtn}
          activeOpacity={0.85}
          onPress={() => handleSelectPlanAndCheckout('basic')}
        >
          <Text style={styles.refBasicBuyBtnText}>BUY NOW</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderPremiumCard = (wide) => (
    <View
      key="premium"
      style={[
        wide ? styles.refCardPremiumWide : styles.refCardPremiumMobile,
        { borderColor: '#D97706' }
      ]}
    >
      {/* Top White Half with Gold Header Pill */}
      <View style={styles.refCardTopWhiteFeatured}>
        <View style={styles.refGoldPillWrapper}>
          <Svg height="26" width="118" style={StyleSheet.absoluteFillObject}>
            <Defs>
              <LinearGradient id="pillGrad" x1="0" y1="0" x2="1" y2="0">
                <Stop offset="0%" stopColor="#FDE047" />
                <Stop offset="50%" stopColor="#F59E0B" />
                <Stop offset="100%" stopColor="#D97706" />
              </LinearGradient>
            </Defs>
            <Rect x="0" y="0" width="118" height="26" rx="13" fill="url(#pillGrad)" />
          </Svg>
          <Text style={styles.refGoldPillText}>PREMIUM</Text>
        </View>

        <Text style={styles.refCardPriceTextFeatured}>$29.99</Text>
        <Text style={styles.refCardDurationTextGold}>
          {lang === 'mr' ? 'वार्षिक पास • फक्त $२.५०/महिना' : 'Annual Pass • Just $2.50/mo'}
        </Text>
      </View>

      {/* Bottom Luxury Gold Container */}
      <View style={[styles.refCardBottomContainer, { minHeight: 345 }]}>
        <Svg
          width="100%"
          height="100%"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          style={StyleSheet.absoluteFillObject}
        >
          <Defs>
            <LinearGradient id="premiumGrad" x1="0" y1="0" x2="0.8" y2="1">
              <Stop offset="0%" stopColor="#F59E0B" />
              <Stop offset="50%" stopColor="#D97706" />
              <Stop offset="100%" stopColor="#92400E" />
            </LinearGradient>
          </Defs>
          <Path
            d="M 0 6 L 50 0 L 100 6 L 100 100 L 0 100 Z"
            fill="url(#premiumGrad)"
          />
        </Svg>

        <View style={styles.refFeaturesList}>
          {plans.premium.features.map((feat, idx) => (
            <View key={idx} style={styles.refFeatureItemRow}>
              <Ionicons name="checkmark-sharp" size={14} color="#451A03" style={styles.refCheckIcon} />
              <Text style={styles.refFeatureTextDark} numberOfLines={2}>
                {feat}
              </Text>
            </View>
          ))}
        </View>

        <TouchableOpacity
          style={styles.refDarkBuyBtn}
          activeOpacity={0.85}
          onPress={() => handleSelectPlanAndCheckout('premium')}
        >
          <Text style={styles.refDarkBuyBtnText}>BUY NOW</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderStandardCard = (wide) => (
    <View
      key="standard"
      style={[
        wide ? styles.refCardWide : styles.refCardMobile,
        { borderColor: colors.border }
      ]}
    >
      {/* Top White Half */}
      <View style={styles.refCardTopWhite}>
        <Text style={styles.refCardCategoryStandard}>STANDARD</Text>
        <Text style={styles.refCardPriceText}>$19.99</Text>
        <Text style={styles.refCardDurationText}>
          {lang === 'mr' ? '६ महिने प्रगत बिलिंग' : '/ 6 months'}
        </Text>
      </View>

      {/* Bottom Metallic Silver/Chrome Container */}
      <View style={styles.refCardBottomContainer}>
        <Svg
          width="100%"
          height="100%"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          style={StyleSheet.absoluteFillObject}
        >
          <Defs>
            <LinearGradient id="standardGrad" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0%" stopColor="#F1F5F9" />
              <Stop offset="45%" stopColor="#CBD5E1" />
              <Stop offset="100%" stopColor="#64748B" />
            </LinearGradient>
          </Defs>
          <Path
            d="M 0 8 L 100 0 L 100 100 L 0 100 Z"
            fill="url(#standardGrad)"
          />
        </Svg>

        <View style={styles.refFeaturesList}>
          {plans.standard.features.map((feat, idx) => (
            <View key={idx} style={styles.refFeatureItemRow}>
              <Ionicons name="checkmark-sharp" size={14} color="#1E293B" style={styles.refCheckIcon} />
              <Text style={styles.refFeatureTextSlate} numberOfLines={2}>
                {feat}
              </Text>
            </View>
          ))}
        </View>

        <TouchableOpacity
          style={styles.refDarkBuyBtn}
          activeOpacity={0.85}
          onPress={() => handleSelectPlanAndCheckout('standard')}
        >
          <Text style={styles.refDarkBuyBtnText}>BUY NOW</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={[styles.root, { backgroundColor: colors.bg }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ================= ACTIVE STATUS CARD ================= */}
        {isPremiumActive ? (
          <View
            style={[
              styles.standardCard,
              {
                backgroundColor: isDark ? '#14382C' : '#ECFDF5',
                borderColor: colors.green
              }
            ]}
          >
            <View style={styles.activeStatusRow}>
              <View style={styles.activeStatusLeft}>
                <View style={[styles.activeStatusBadge, { backgroundColor: '#10B981' }]}>
                  <Ionicons name="shield-checkmark" size={13} color="#FFFFFF" />
                  <Text style={styles.activeStatusBadgeText}>
                    {t('premiumOfficerActive', 'PREMIUM OFFICER ACTIVE')}
                  </Text>
                </View>
                <Text style={[styles.activePlanTitle, { color: colors.text }]}>
                  {activePlanName}
                </Text>
                <Text style={[styles.activePlanExpiry, { color: colors.muted }]}>
                  {t('subscriptionActiveUntil', 'Active until {date}').replace(
                    '{date}',
                    expiryDate || '1 Year'
                  )}
                </Text>
              </View>

              <TouchableOpacity
                style={[
                  styles.manageBtn,
                  { backgroundColor: isDark ? '#1E293B' : '#FFFFFF', borderColor: colors.border }
                ]}
                activeOpacity={0.8}
                onPress={() => setManageModalVisible(true)}
              >
                <Ionicons name="settings-outline" size={15} color={colors.text} style={{ marginRight: 5 }} />
                <Text style={[styles.manageBtnText, { color: colors.text }]}>
                  {t('manageSubscription', 'Manage')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : null}

        {/* ================= HERO HEADER CARD ================= */}
        <View style={[styles.standardCard, styles.heroCard, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
          <View
            style={[
              styles.crownCircle,
              {
                backgroundColor: isDark ? '#1E3A5F' : '#EFF6FF',
                borderColor: isDark ? '#3B82F6' : '#BFDBFE'
              }
            ]}
          >
            <Ionicons name="ribbon" size={32} color="#1D4ED8" />
          </View>

          <Text style={[styles.heroHeading, { color: colors.text }]}>
            {t('upgradeToPremium', 'Upgrade to Abhyas Premium')}
          </Text>

          <Text style={[styles.heroSubtitle, { color: colors.muted }]}>
            {t('premiumSubtitle', 'Study Smarter. Track Better. Achieve More.')}
          </Text>

          <View style={styles.heroPillRow}>
            <View style={[styles.heroStatusPill, { backgroundColor: isDark ? '#1E293B' : '#F1F5F9' }]}>
              <Ionicons name="school-outline" size={13} color={colors.teal} style={{ marginRight: 4 }} />
              <Text style={[styles.heroStatusPillText, { color: colors.text }]}>
                UPSC & MPSC Civil Services
              </Text>
            </View>
            <View style={[styles.heroStatusPill, { backgroundColor: isDark ? '#14382C' : '#ECFDF5' }]}>
              <Ionicons name="lock-open-outline" size={13} color="#10B981" style={{ marginRight: 4 }} />
              <Text style={[styles.heroStatusPillText, { color: '#047857' }]}>
                Core Tracking Free Forever
              </Text>
            </View>
          </View>
        </View>

        {/* ========================================================================= */}
        {/* ================= PRICE LIST COLLECTION (FULL WIDTH RESPONSIVE) ========= */}
        {/* ========================================================================= */}
        <View
          style={[
            styles.refContainer,
            {
              backgroundColor: colors.cardBg,
              borderColor: colors.border
            }
          ]}
        >
          {/* Header */}
          <View style={styles.refHeaderWrap}>
            <View style={styles.refTitleRow}>
              <Text style={[styles.refTitleBold, { color: colors.text }]}>PRICE LIST </Text>
              <Text style={[styles.refTitleLight, { color: colors.text }]}>COLLECTION</Text>
            </View>
            <Text style={[styles.refSubtitle, { color: colors.muted }]}>
              {lang === 'mr'
                ? 'युपीएससी व एमपीएससी परीक्षांसाठी विशेष अभ्यासक्रम पास'
                : 'Tailored for UPSC & MPSC Civil Services Aspirants'}
            </Text>
            {!isWide && (
              <View
                style={[
                  styles.refSwipeHintPill,
                  { backgroundColor: isDark ? '#1E293B' : '#F1F5F9' }
                ]}
              >
                <Ionicons name="swap-horizontal" size={12} color={colors.teal} style={{ marginRight: 5 }} />
                <Text style={[styles.refSwipeHintText, { color: colors.teal }]}>
                  {lang === 'mr' ? 'सर्व प्लॅन्स पाहण्यासाठी डावीकडे/उजवीकडे स्वाइप करा' : 'Swipe horizontally to compare cards'}
                </Text>
              </View>
            )}
          </View>

          {/* Cards Row: On Wide Screens it uses the WHOLE space! On Mobile it scrolls */}
          {isWide ? (
            <View style={styles.refCardsRowWide}>
              {renderBasicCard(true)}
              {renderPremiumCard(true)}
              {renderStandardCard(true)}
            </View>
          ) : (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.refCardsRowMobile}
            >
              {renderBasicCard(false)}
              {renderPremiumCard(false)}
              {renderStandardCard(false)}
            </ScrollView>
          )}

          {/* Reassurance Free Guarantee Banner (Full Width) */}
          <View
            style={[
              styles.refFreeGuaranteeRow,
              {
                backgroundColor: isDark ? '#14382C' : '#ECFDF5',
                borderColor: isDark ? '#065F46' : '#A7F3D0'
              }
            ]}
          >
            <Ionicons name="shield-checkmark" size={16} color="#10B981" style={{ marginRight: 6 }} />
            <Text style={[styles.refFreeGuaranteeText, { color: isDark ? '#A7F3D0' : '#065F46' }]}>
              {lang === 'mr'
                ? 'अभ्यास टायमर आणि मूलभूत ट्रॅकिंग १००% कायमस्वरूपी मोफत राहील'
                : 'Study Timer, Stopwatch & Basic Checklist are 100% Free Forever'}
            </Text>
          </View>
        </View>

        {/* ================= PRIMARY CTA BUTTON ================= */}
        <TouchableOpacity
          style={[styles.prominentUpgradeBtn, { backgroundColor: colors.blue }]}
          activeOpacity={0.85}
          onPress={() => setCheckoutModalVisible(true)}
        >
          <View style={styles.upgradeBtnInner}>
            <View style={{ flex: 1 }}>
              <Text style={styles.upgradeBtnTitle}>
                {t('upgradeToPremiumBtn', 'Upgrade to Premium')}
              </Text>
              <Text style={styles.upgradeBtnSub}>
                {selectedPlan.title} • {selectedPlan.priceLabel}{selectedPlan.durationLabel}
              </Text>
            </View>
            <View style={styles.upgradeBtnArrow}>
              <Ionicons name="arrow-forward" size={18} color={colors.blue} />
            </View>
          </View>
        </TouchableOpacity>

        {/* Auto renewal subtext */}
        <Text style={[styles.autoRenewNotice, { color: colors.muted }]}>
          {t(
            'renewalInfo',
            'Auto-renews until cancelled. Cancel anytime in Google Play Store or account settings.'
          )}
        </Text>

        {/* ================= RESTORE PURCHASES & LEGAL LINKS ================= */}
        <View style={styles.legalLinksRow}>
          <TouchableOpacity
            style={styles.legalBtn}
            onPress={handleRestorePurchases}
          >
            <Ionicons name="refresh-outline" size={15} color={colors.teal} style={{ marginRight: 4 }} />
            <Text style={[styles.legalBtnText, { color: colors.teal }]}>
              {t('restorePurchases', 'Restore Purchases')}
            </Text>
          </TouchableOpacity>

          <Text style={[styles.legalDot, { color: colors.muted }]}>•</Text>

          <TouchableOpacity
            style={styles.legalBtn}
            onPress={() => setTermsModalVisible(true)}
          >
            <Text style={[styles.legalBtnText, { color: colors.muted }]}>
              {t('termsAndPrivacy', 'Terms & Conditions • Privacy Policy')}
            </Text>
          </TouchableOpacity>
        </View>

        {/* ================= CARD 4: FREE VS PREMIUM COMPARISON MATRIX ================= */}
        <View style={[styles.standardCard, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
          <Text style={[styles.cardSectionTitle, { color: colors.text }]}>
            {lang === 'mr' ? 'मोफत वि. प्रीमियम वैशिष्ट्ये तुलना' : 'Free vs Premium Comparison'}
          </Text>
          <Text style={[styles.cardSectionSub, { color: colors.muted }]}>
            {lang === 'mr' ? 'अभ्यास ट्रॅकर मधील संपूर्ण पारदर्शकता' : 'Full transparency on all features & limits'}
          </Text>

          <View style={[styles.tableHeaderRow, { backgroundColor: isDark ? '#1E3A5F' : '#EFF6FF', borderColor: colors.border }]}>
            <Text style={[styles.tableColFeature, { color: colors.text, fontWeight: '700' }]}>
              {lang === 'mr' ? 'वैशिष्ट्य' : 'Feature'}
            </Text>
            <Text style={[styles.tableColFree, { color: colors.muted, fontWeight: '600' }]}>
              {lang === 'mr' ? 'मोफत' : 'Free'}
            </Text>
            <Text style={[styles.tableColPremium, { color: colors.blue, fontWeight: '800' }]}>
              {lang === 'mr' ? 'प्रीमियम' : 'Premium'}
            </Text>
          </View>

          {[
            {
              feat: lang === 'mr' ? 'अभ्यास इतिहास' : 'Study History',
              free: lang === 'mr' ? '७ दिवस' : '7 Days',
              premium: lang === 'mr' ? 'अमर्याद' : 'Unlimited',
              highlight: true
            },
            {
              feat: lang === 'mr' ? 'अभ्यास अहवाल' : 'Performance Reports',
              free: lang === 'mr' ? 'दैनंदिन' : 'Daily only',
              premium: lang === 'mr' ? 'साप्ताहिक, मासिक व वार्षिक' : 'Weekly, Monthly & Annual'
            },
            {
              feat: lang === 'mr' ? 'AI अभ्यास मित्र' : 'AI Abhyas Mitra',
              free: lang === 'mr' ? '५ शंका / दिवस' : '5 queries / day',
              premium: lang === 'mr' ? 'अमर्याद २४/७' : 'Unlimited 24/7',
              highlight: true
            },
            {
              feat: lang === 'mr' ? 'अभ्यास नियोजन' : 'Study Planner',
              free: lang === 'mr' ? 'मूलभूत' : 'Basic',
              premium: lang === 'mr' ? 'स्मार्ट रुटीन व वेळापत्रक' : 'Smart routines & workload'
            },
            {
              feat: lang === 'mr' ? 'क्लाउड बॅकअप व सिंक' : 'Cloud Sync & Backup',
              free: lang === 'mr' ? 'स्थानिक' : 'Local device',
              premium: lang === 'mr' ? 'क्लाउड बॅकअप' : 'Cloud multi-device',
              highlight: true
            },
            {
              feat: lang === 'mr' ? 'मुख्य उत्तर तपासणी' : 'Mains Answer Grading',
              free: '❌',
              premium: lang === 'mr' ? 'AI गुणदान व मार्गदर्शन' : 'AI Rubric & Scoring'
            },
            {
              feat: lang === 'mr' ? 'PYQ प्रश्नसंच' : 'Solved PYQ Database',
              free: lang === 'mr' ? 'मागील ३ वर्षे' : '3 Years',
              premium: lang === 'mr' ? '२५+ वर्षे स्पष्टीकरणासह' : '25+ Years solved'
            },
            {
              feat: lang === 'mr' ? 'प्राधान्य मदत' : 'Support Priority',
              free: lang === 'mr' ? 'मानक' : 'Standard',
              premium: lang === 'mr' ? 'व्हीआयपी प्राधान्य' : 'VIP Priority'
            }
          ].map((row, idx) => (
            <View
              key={idx}
              style={[
                styles.tableDataRow,
                {
                  borderColor: colors.border,
                  backgroundColor: row.highlight
                    ? isDark ? '#14253D' : '#F0F9FF'
                    : 'transparent'
                }
              ]}
            >
              <Text style={[styles.tableColFeature, { color: colors.text, fontSize: 12 }]}>
                {row.feat}
              </Text>
              <Text style={[styles.tableColFree, { color: colors.muted, fontSize: 11 }]}>
                {row.free}
              </Text>
              <View style={styles.tableColPremium}>
                <Ionicons name="checkmark-circle" size={14} color="#10B981" style={{ marginRight: 4 }} />
                <Text style={{ color: colors.blue, fontSize: 11, fontWeight: '700', flex: 1 }}>
                  {row.premium}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* ================= CARD 5: STUDENT SUCCESS STORIES ================= */}
        <View style={[styles.standardCard, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
          <Text style={[styles.cardSectionTitle, { color: colors.text }]}>
            {lang === 'mr' ? 'यशस्वी विद्यार्थ्यांचे अनुभव' : 'Ranker Reviews & Experiences'}
          </Text>
          <Text style={[styles.cardSectionSub, { color: colors.muted, marginBottom: 12 }]}>
            {lang === 'mr' ? 'अभ्यास ट्रॅकर वापरून परीक्षा उत्तीर्ण झालेले अधिकारी' : 'Aspirants who cleared civil services exams with Abhyas Tracker'}
          </Text>

          {[
            {
              name: lang === 'mr' ? 'संदीप गायकवाड' : 'Sandeep Gaikwad',
              badge: lang === 'mr' ? 'MPSC राज्यसेवा २०२३ (रँक २८)' : 'MPSC Rajyaseva 2023 (Rank 28)',
              quote: lang === 'mr'
                ? '“प्रीमियम मधील प्रगत विश्लेषण आणि अभ्यास नियोजन मुळे माझा दैनंदिन अभ्यास शिस्तबद्ध झाला.”'
                : '“The advanced analytics and weekly performance reports gave me the discipline needed to crack Rajyaseva.”'
            },
            {
              name: lang === 'mr' ? 'प्रिया देशमुख' : 'Priya Deshmukh',
              badge: lang === 'mr' ? 'UPSC नागरी सेवा (AIR २१४)' : 'UPSC Civil Services (AIR 214)',
              quote: lang === 'mr'
                ? '“AI अभ्यास मित्राने रात्री उशिरा येणाऱ्या राज्यघटनेच्या सर्व शंका त्वरित सोडवल्या. अत्यंत उपयुक्त!”'
                : '“Abhyas Mitra mentor resolved my late night Polity doubts with precise constitutional articles instantly.”'
            }
          ].map((item, idx) => (
            <View
              key={idx}
              style={[
                styles.testimonialItemBox,
                { backgroundColor: isDark ? '#111A22' : '#F8FAFC', borderColor: colors.border }
              ]}
            >
              <View style={styles.testimonialTopRow}>
                <View style={[styles.avatarCircleSmall, { backgroundColor: colors.goldBg }]}>
                  <Text style={[styles.avatarInitialSmall, { color: colors.gold }]}>
                    {item.name.charAt(0)}
                  </Text>
                </View>
                <View style={{ flex: 1, marginLeft: 9 }}>
                  <Text style={[styles.testimonialAuthorName, { color: colors.text }]}>
                    {item.name}
                  </Text>
                  <Text style={[styles.testimonialAuthorExam, { color: colors.blue }]}>
                    {item.badge}
                  </Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Ionicons key={s} name="star" size={12} color="#F59E0B" />
                  ))}
                </View>
              </View>
              <Text style={[styles.testimonialQuoteText, { color: colors.muted }]}>
                {item.quote}
              </Text>
            </View>
          ))}
        </View>

        {/* ================= CARD 6: FREQUENTLY ASKED QUESTIONS ================= */}
        <View style={[styles.standardCard, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
          <Text style={[styles.cardSectionTitle, { color: colors.text, marginBottom: 12 }]}>
            {lang === 'mr' ? 'नेहमी विचारले जाणारे प्रश्न (FAQ)' : 'Frequently Asked Questions'}
          </Text>

          {faqs.map((faq, idx) => {
            const isExpanded = expandedFaq === idx;
            return (
              <TouchableOpacity
                key={idx}
                activeOpacity={0.7}
                onPress={() => setExpandedFaq(isExpanded ? null : idx)}
                style={[
                  styles.faqItemCard,
                  { backgroundColor: isDark ? '#111A22' : '#F8FAFC', borderColor: colors.border }
                ]}
              >
                <View style={styles.faqHeaderRow}>
                  <Text style={[styles.faqQuestionText, { color: colors.text }]}>
                    {faq.q}
                  </Text>
                  <Ionicons
                    name={isExpanded ? 'chevron-up' : 'chevron-down'}
                    size={17}
                    color={colors.muted}
                  />
                </View>
                {isExpanded && (
                  <Text style={[styles.faqAnswerText, { color: colors.muted }]}>
                    {faq.a}
                  </Text>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* ================= PAYMENT CONFIRMATION MODAL ================= */}
      <Modal
        visible={checkoutModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setCheckoutModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.checkoutModalSheet,
              { backgroundColor: colors.cardBg, borderColor: colors.border }
            ]}
          >
            <View style={styles.modalHeaderRow}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.modalSheetTitle, { color: colors.text }]}>
                  {t('paymentConfirmation', 'Payment Confirmation')}
                </Text>
                <Text style={[styles.modalSheetSub, { color: colors.muted }]}>
                  {selectedPlan.title} • {selectedPlan.durationLabel}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setCheckoutModalVisible(false)}
                style={styles.modalCloseButton}
              >
                <Ionicons name="close" size={20} color={colors.muted} />
              </TouchableOpacity>
            </View>

            <View style={[styles.orderSummaryCard, { backgroundColor: isDark ? '#111A22' : '#F8FAFC', borderColor: colors.border }]}>
              <View style={styles.summaryRow}>
                <Text style={[styles.summaryLabel, { color: colors.muted }]}>
                  {t('selectedPlan', 'Selected Plan')}
                </Text>
                <Text style={[styles.summaryValue, { color: colors.text }]}>
                  {selectedPlan.title}
                </Text>
              </View>

              <View style={styles.summaryRow}>
                <Text style={[styles.summaryLabel, { color: colors.muted }]}>
                  {t('billingCycle', 'Billing Cycle')}
                </Text>
                <Text style={[styles.summaryValue, { color: colors.text }]}>
                  {selectedPlan.periodDesc}
                </Text>
              </View>

              <View style={[styles.summaryDivider, { backgroundColor: colors.border }]} />

              <View style={styles.summaryRowTotal}>
                <Text style={[styles.summaryTotalLabel, { color: colors.text }]}>
                  {t('totalAmountDue', 'Total Amount Due')}
                </Text>
                <Text style={[styles.summaryTotalVal, { color: colors.blue }]}>
                  {selectedPlan.priceLabel}
                </Text>
              </View>
            </View>

            <View style={styles.paymentModesBox}>
              <Text style={[styles.paymentModesLabel, { color: colors.muted }]}>
                {t('supportedPaymentMethods', 'Supported Payment Methods')}
              </Text>
              <View style={styles.paymentBadgesRow}>
                <View style={[styles.payModePill, { backgroundColor: isDark ? '#1E293B' : '#F1F5F9' }]}>
                  <Ionicons name="logo-google" size={14} color="#EA4335" />
                  <Text style={[styles.payModeText, { color: colors.text }]}>Google Pay</Text>
                </View>
                <View style={[styles.payModePill, { backgroundColor: isDark ? '#1E293B' : '#F1F5F9' }]}>
                  <Ionicons name="logo-apple" size={14} color={colors.text} />
                  <Text style={[styles.payModeText, { color: colors.text }]}>Apple Pay</Text>
                </View>
                <View style={[styles.payModePill, { backgroundColor: isDark ? '#1E293B' : '#F1F5F9' }]}>
                  <Ionicons name="card" size={14} color="#2563EB" />
                  <Text style={[styles.payModeText, { color: colors.text }]}>Cards / UPI</Text>
                </View>
              </View>
            </View>

            <TouchableOpacity
              style={[
                styles.confirmPaymentBtn,
                { backgroundColor: paymentProcessing ? '#94A3B8' : colors.blue }
              ]}
              disabled={paymentProcessing}
              activeOpacity={0.85}
              onPress={handleConfirmPayment}
            >
              {paymentProcessing ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <View style={styles.confirmPaymentInner}>
                  <Ionicons name="lock-closed" size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
                  <Text style={styles.confirmPaymentBtnText}>
                    {t('payNow', 'Pay {amount}').replace('{amount}', selectedPlan.priceLabel)}
                  </Text>
                </View>
              )}
            </TouchableOpacity>

            <Text style={[styles.modalSecureNotice, { color: colors.muted }]}>
              {t('secureCheckoutNotice', '256-Bit SSL Encrypted • Cancel Anytime in Play Store')}
            </Text>
          </View>
        </View>
      </Modal>

      {/* ================= ACTIVATION CELEBRATION MODAL ================= */}
      <Modal
        visible={successModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setSuccessModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.successCard, { backgroundColor: colors.cardBg, borderColor: colors.green }]}>
            <View style={styles.successIconCircle}>
              <Ionicons name="checkmark-circle" size={68} color="#10B981" />
            </View>

            <Text style={[styles.successTitle, { color: colors.text }]}>
              {t('premiumActivatedTitle', 'Premium Officer Activated!')}
            </Text>

            <Text style={[styles.successDesc, { color: colors.muted }]}>
              {t(
                'premiumActivatedDesc',
                'Congratulations! Your account has been upgraded to Premium Officer All-Access. Full civil services study tools are now unlocked.'
              )}
            </Text>

            <View style={[styles.successInfoBox, { backgroundColor: isDark ? '#14382C' : '#ECFDF5' }]}>
              <Text style={[styles.successPlanName, { color: '#047857' }]}>
                {selectedPlan.title}
              </Text>
              <Text style={[styles.successValidText, { color: '#059669' }]}>
                {t('subscriptionActiveUntil', 'Active until {date}').replace(
                  '{date}',
                  expiryDate || '1 Year'
                )}
              </Text>
            </View>

            <TouchableOpacity
              style={[styles.startStudyingBtn, { backgroundColor: colors.blue }]}
              onPress={() => {
                setSuccessModalVisible(false);
                if (onSelectTab) onSelectTab('Dashboard');
              }}
            >
              <Text style={styles.startStudyingBtnText}>
                {t('startStudyingBtn', 'Start Studying with Premium')}
              </Text>
              <Ionicons name="arrow-forward" size={16} color="#FFFFFF" style={{ marginLeft: 6 }} />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ================= MANAGE SUBSCRIPTION MODAL ================= */}
      <Modal
        visible={manageModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setManageModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.manageModalSheet, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
            <View style={styles.modalHeaderRow}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.modalSheetTitle, { color: colors.text }]}>
                  {t('manageSubscription', 'Manage Subscription')}
                </Text>
                <Text style={[styles.modalSheetSub, { color: colors.muted }]}>
                  {lang === 'mr' ? 'आपले सक्रिय सबस्क्रिप्शन तपशील व पर्याय' : 'Your current active subscription details'}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setManageModalVisible(false)}
                style={styles.modalCloseButton}
              >
                <Ionicons name="close" size={20} color={colors.muted} />
              </TouchableOpacity>
            </View>

            <View style={[styles.manageInfoBox, { backgroundColor: isDark ? '#111A22' : '#F8FAFC', borderColor: colors.border }]}>
              <View style={styles.manageInfoRow}>
                <Text style={[styles.manageInfoLabel, { color: colors.muted }]}>
                  {t('activePlanLabel', 'Current Active Plan')}
                </Text>
                <Text style={[styles.manageInfoVal, { color: colors.text }]}>
                  {activePlanName}
                </Text>
              </View>
              <View style={styles.manageInfoRow}>
                <Text style={[styles.manageInfoLabel, { color: colors.muted }]}>
                  {lang === 'mr' ? 'स्थिती' : 'Status'}
                </Text>
                <View style={[styles.activePillSmall, { backgroundColor: '#10B981' }]}>
                  <Text style={styles.activePillSmallText}>ACTIVE</Text>
                </View>
              </View>
              <View style={styles.manageInfoRow}>
                <Text style={[styles.manageInfoLabel, { color: colors.muted }]}>
                  {lang === 'mr' ? 'वैधता दिनांक' : 'Valid Until'}
                </Text>
                <Text style={[styles.manageInfoVal, { color: colors.text }]}>
                  {expiryDate || '1 Year'}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={[styles.manageActionBtn, { borderColor: colors.blue }]}
              onPress={() => {
                setManageModalVisible(false);
                setCheckoutModalVisible(true);
              }}
            >
              <Ionicons name="swap-horizontal" size={18} color={colors.blue} style={{ marginRight: 8 }} />
              <Text style={[styles.manageActionBtnText, { color: colors.blue }]}>
                {t('changePlan', 'Change Plan')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.manageActionBtn, { borderColor: colors.teal }]}
              onPress={handleRestorePurchases}
            >
              <Ionicons name="refresh" size={18} color={colors.teal} style={{ marginRight: 8 }} />
              <Text style={[styles.manageActionBtnText, { color: colors.teal }]}>
                {t('restorePurchases', 'Restore Purchases')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.manageActionBtn, { borderColor: '#EF4444' }]}
              onPress={handleCancelSubscription}
            >
              <Ionicons name="close-circle-outline" size={18} color="#EF4444" style={{ marginRight: 8 }} />
              <Text style={[styles.manageActionBtnText, { color: '#EF4444' }]}>
                {t('cancelSubscription', 'Cancel Subscription')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ================= TERMS & PRIVACY MODAL ================= */}
      <Modal
        visible={termsModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setTermsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.termsModalSheet, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
            <View style={styles.modalHeaderRow}>
              <Text style={[styles.modalSheetTitle, { color: colors.text }]}>
                {t('termsAndPrivacy', 'Terms & Conditions • Privacy Policy')}
              </Text>
              <TouchableOpacity
                onPress={() => setTermsModalVisible(false)}
                style={styles.modalCloseButton}
              >
                <Ionicons name="close" size={20} color={colors.muted} />
              </TouchableOpacity>
            </View>

            <ScrollView style={{ maxHeight: 380 }} showsVerticalScrollIndicator={false}>
              <Text style={[styles.termsHeading, { color: colors.text }]}>
                1. Subscription & Auto-Renewal
              </Text>
              <Text style={[styles.termsParagraph, { color: colors.muted }]}>
                Subscriptions automatically renew unless auto-renew is turned off at least 24 hours before the end of the current billing cycle. You may manage or cancel your subscription at any time through your Google Play Store account settings or in-app management interface.
              </Text>

              <Text style={[styles.termsHeading, { color: colors.text }]}>
                2. Free Access Guarantee
              </Text>
              <Text style={[styles.termsParagraph, { color: colors.muted }]}>
                Abhyas Tracker will always maintain core study timer, basic stopwatch tracking, and essential syllabus checklists free for all civil services aspirants. Premium unlocks advanced analytics, unlimited history, cloud backup, and AI mentor features.
              </Text>

              <Text style={[styles.termsHeading, { color: colors.text }]}>
                3. Privacy & Data Security
              </Text>
              <Text style={[styles.termsParagraph, { color: colors.muted }]}>
                Your personal study data, logs, and account details are stored securely using 256-bit encryption. We never sell or share your study records with third parties.
              </Text>
            </ScrollView>

            <TouchableOpacity
              style={[styles.termsCloseBtn, { backgroundColor: colors.blue }]}
              onPress={() => setTermsModalVisible(false)}
            >
              <Text style={styles.termsCloseBtnText}>
                {lang === 'mr' ? 'समजले व मान्य आहे' : 'I Understand & Agree'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 90
  },

  // Standard Card Container (Clean Light Theme)
  standardCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2
  },

  // Active Status Row
  activeStatusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  activeStatusLeft: {
    flex: 1,
    marginRight: 10
  },
  activeStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 4
  },
  activeStatusBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    marginLeft: 4,
    letterSpacing: 0.5
  },
  activePlanTitle: {
    fontSize: 15,
    fontWeight: '800'
  },
  activePlanExpiry: {
    fontSize: 12,
    marginTop: 2
  },
  manageBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
    borderWidth: 1
  },
  manageBtnText: {
    fontSize: 12,
    fontWeight: '700'
  },

  // Hero Card
  heroCard: {
    alignItems: 'center',
    paddingVertical: 20
  },
  crownCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    marginBottom: 12
  },
  heroHeading: {
    fontSize: 21,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 6,
    letterSpacing: -0.3
  },
  heroSubtitle: {
    fontSize: 13,
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 8,
    marginBottom: 14
  },
  heroPillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8
  },
  heroStatusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12
  },
  heroStatusPillText: {
    fontSize: 11,
    fontWeight: '700'
  },

  // =========================================================================
  // ================= PRICE LIST COLLECTION (FULL WIDTH RESPONSIVE) =========
  // =========================================================================
  refContainer: {
    borderRadius: 20,
    borderWidth: 1,
    paddingVertical: 22,
    paddingHorizontal: 16,
    marginVertical: 12,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2
  },
  refHeaderWrap: {
    alignItems: 'center',
    marginBottom: 18,
    paddingHorizontal: 8
  },
  refTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  refTitleBold: {
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 1.2
  },
  refTitleLight: {
    fontSize: 20,
    fontWeight: '400',
    letterSpacing: 1.5,
    opacity: 0.8
  },
  refSubtitle: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 4,
    textAlign: 'center'
  },
  refSwipeHintPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 8
  },
  refSwipeHintText: {
    fontSize: 11,
    fontWeight: '700'
  },

  // Wide layout: Stretches across the FULL screen width!
  refCardsRowWide: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'stretch',
    justifyContent: 'space-between',
    gap: 16,
    paddingVertical: 8
  },

  // Mobile layout: Smooth horizontal scroll for phone screens
  refCardsRowMobile: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 8,
    gap: 14
  },

  // Wide cards: Flexes to fill the entire container width!
  refCardWide: {
    flex: 1,
    borderRadius: 20,
    borderWidth: 1,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3
  },
  refCardPremiumWide: {
    flex: 1.06,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: '#D97706',
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    shadowColor: '#D97706',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.22,
    shadowRadius: 10,
    elevation: 6
  },

  // Mobile cards: Fixed comfortable width for mobile phones
  refCardMobile: {
    width: 288,
    borderRadius: 20,
    borderWidth: 1,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 3
  },
  refCardPremiumMobile: {
    width: 304,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: '#D97706',
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    shadowColor: '#D97706',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5
  },

  refCardTopWhite: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center'
  },
  refCardCategoryBasic: {
    color: '#4B5563',
    fontSize: 13.5,
    fontWeight: '800',
    letterSpacing: 1.2,
    marginBottom: 4
  },
  refCardCategoryStandard: {
    color: '#4B5563',
    fontSize: 13.5,
    fontWeight: '800',
    letterSpacing: 1.2,
    marginBottom: 4
  },
  refCardPriceText: {
    color: '#0F172A',
    fontSize: 32,
    fontWeight: '900'
  },
  refCardDurationText: {
    color: '#64748B',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2
  },
  refCardDurationTextGold: {
    color: '#B45309',
    fontSize: 11,
    fontWeight: '700',
    marginTop: 2
  },

  // Premium Top
  refCardTopWhiteFeatured: {
    backgroundColor: '#FFFFFF',
    paddingTop: 14,
    paddingBottom: 16,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center'
  },
  refGoldPillWrapper: {
    width: 118,
    height: 26,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6
  },
  refGoldPillText: {
    color: '#451A03',
    fontSize: 11.5,
    fontWeight: '900',
    letterSpacing: 1.2
  },
  refCardPriceTextFeatured: {
    color: '#0F172A',
    fontSize: 36,
    fontWeight: '900'
  },

  // Bottom Colored Containers (Responsive Height & Width)
  refCardBottomContainer: {
    width: '100%',
    minHeight: 328,
    paddingHorizontal: 18,
    paddingTop: 36,
    paddingBottom: 16,
    justifyContent: 'space-between',
    position: 'relative'
  },
  refFeaturesList: {
    gap: 8,
    marginBottom: 16
  },
  refFeatureItemRow: {
    flexDirection: 'row',
    alignItems: 'flex-start'
  },
  refCheckIcon: {
    marginRight: 6,
    marginTop: 1
  },
  refFeatureTextWhite: {
    color: '#FFFFFF',
    fontSize: 11.5,
    lineHeight: 16,
    flex: 1,
    fontWeight: '500'
  },
  refFeatureTextDark: {
    color: '#1A0C02',
    fontSize: 11.5,
    lineHeight: 16,
    flex: 1,
    fontWeight: '600'
  },
  refFeatureTextSlate: {
    color: '#0F172A',
    fontSize: 11.5,
    lineHeight: 16,
    flex: 1,
    fontWeight: '600'
  },

  // Buttons matching Reference
  refBasicBuyBtn: {
    backgroundColor: '#D946EF', // Vibrant Magenta pill button
    borderRadius: 24,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#D946EF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3
  },
  refBasicBuyBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.8
  },
  refDarkBuyBtn: {
    backgroundColor: '#1E293B', // Solid Charcoal/Navy pill button
    borderRadius: 24,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3
  },
  refDarkBuyBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.8
  },

  // Reassurance Guarantee Row
  refFreeGuaranteeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 16,
    width: '100%'
  },
  refFreeGuaranteeText: {
    fontSize: 11.5,
    fontWeight: '700',
    textAlign: 'center'
  },

  // Prominent Upgrade Button
  prominentUpgradeBtn: {
    borderRadius: 14,
    paddingVertical: 15,
    paddingHorizontal: 18,
    marginTop: 16,
    marginBottom: 10,
    shadowColor: '#1D4ED8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4
  },
  upgradeBtnInner: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  upgradeBtnTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF'
  },
  upgradeBtnSub: {
    fontSize: 12,
    color: '#FFFFFFCC',
    marginTop: 2
  },
  upgradeBtnArrow: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12
  },
  autoRenewNotice: {
    fontSize: 11,
    textAlign: 'center',
    lineHeight: 16,
    marginBottom: 16,
    paddingHorizontal: 12
  },

  // Legal Links
  legalLinksRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    flexWrap: 'wrap'
  },
  legalBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4
  },
  legalBtnText: {
    fontSize: 12,
    fontWeight: '600'
  },
  legalDot: {
    marginHorizontal: 8,
    fontSize: 12
  },

  // Comparison Matrix Card
  cardSectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 3
  },
  cardSectionSub: {
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 14
  },
  tableHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 4
  },
  tableColFeature: {
    flex: 2,
    fontSize: 12
  },
  tableColFree: {
    flex: 1.5,
    fontSize: 11,
    textAlign: 'center'
  },
  tableColPremium: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center'
  },
  tableDataRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderRadius: 6
  },

  // Testimonials
  testimonialItemBox: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    marginBottom: 10
  },
  testimonialTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6
  },
  avatarCircleSmall: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center'
  },
  avatarInitialSmall: {
    fontSize: 14,
    fontWeight: '800'
  },
  testimonialAuthorName: {
    fontSize: 12,
    fontWeight: '800'
  },
  testimonialAuthorExam: {
    fontSize: 10,
    fontWeight: '600'
  },
  testimonialQuoteText: {
    fontSize: 11.5,
    lineHeight: 17,
    fontStyle: 'italic'
  },

  // FAQs
  faqItemCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    marginBottom: 8
  },
  faqHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  faqQuestionText: {
    fontSize: 12.5,
    fontWeight: '700',
    flex: 1,
    marginRight: 8
  },
  faqAnswerText: {
    fontSize: 11.5,
    lineHeight: 17,
    marginTop: 8
  },

  // Modal Overlay
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  checkoutModalSheet: {
    width: '100%',
    maxWidth: 540,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    borderBottomWidth: 0,
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24
  },
  modalHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16
  },
  modalSheetTitle: {
    fontSize: 18,
    fontWeight: '800'
  },
  modalSheetSub: {
    fontSize: 12,
    marginTop: 2
  },
  modalCloseButton: {
    padding: 4
  },
  orderSummaryCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    marginBottom: 14
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6
  },
  summaryLabel: {
    fontSize: 12
  },
  summaryValue: {
    fontSize: 12,
    fontWeight: '600'
  },
  summaryDivider: {
    height: 1,
    marginVertical: 8
  },
  summaryRowTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  summaryTotalLabel: {
    fontSize: 15,
    fontWeight: '800'
  },
  summaryTotalVal: {
    fontSize: 20,
    fontWeight: '900'
  },

  // Payment modes
  paymentModesBox: {
    marginBottom: 14
  },
  paymentModesLabel: {
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 6
  },
  paymentBadgesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6
  },
  payModePill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 8
  },
  payModeText: {
    fontSize: 11,
    fontWeight: '600',
    marginLeft: 4
  },
  confirmPaymentBtn: {
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8
  },
  confirmPaymentInner: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  confirmPaymentBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800'
  },
  modalSecureNotice: {
    fontSize: 11,
    textAlign: 'center'
  },

  // Success Modal
  successCard: {
    width: '90%',
    maxWidth: 420,
    borderRadius: 22,
    borderWidth: 2,
    padding: 24,
    alignItems: 'center',
    margin: 'auto'
  },
  successIconCircle: {
    marginBottom: 12
  },
  successTitle: {
    fontSize: 18,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 8
  },
  successDesc: {
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
    marginBottom: 16
  },
  successInfoBox: {
    width: '100%',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 18
  },
  successPlanName: {
    fontSize: 14,
    fontWeight: '800'
  },
  successValidText: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2
  },
  startStudyingBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingVertical: 13,
    borderRadius: 12
  },
  startStudyingBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700'
  },

  // Manage Modal
  manageModalSheet: {
    width: '100%',
    maxWidth: 540,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    borderBottomWidth: 0,
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24
  },
  manageInfoBox: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    marginBottom: 16
  },
  manageInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
  },
  manageInfoLabel: {
    fontSize: 12
  },
  manageInfoVal: {
    fontSize: 13,
    fontWeight: '700'
  },
  activePillSmall: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 10
  },
  activePillSmallText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800'
  },
  manageActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    marginBottom: 10
  },
  manageActionBtnText: {
    fontSize: 13,
    fontWeight: '700'
  },

  // Terms Modal
  termsModalSheet: {
    width: '100%',
    maxWidth: 540,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    borderBottomWidth: 0,
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24
  },
  termsHeading: {
    fontSize: 13,
    fontWeight: '800',
    marginTop: 10,
    marginBottom: 4
  },
  termsParagraph: {
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 10
  },
  termsCloseBtn: {
    marginTop: 14,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center'
  },
  termsCloseBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700'
  }
});
