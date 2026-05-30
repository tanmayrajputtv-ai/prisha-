import { ServiceItem, ReviewItem } from './types';

export const servicesList: ServiceItem[] = [
  {
    id: 1,
    emoji: '🔬',
    name: 'Skin Consultation',
    description: 'Comprehensive dermatological consultation, mapping out skin health and addressing concerns with science-backed solutions.',
    priceRange: '₹500'
  },
  {
    id: 2,
    emoji: '⚡',
    name: 'CO2 Laser Treatment',
    description: 'Expert fractional carbon dioxide laser resurfacing tailored to eliminate deep-seated acne scars, wrinkles, and pigmentation.',
    priceRange: '₹5,000–₹15,000'
  },
  {
    id: 3,
    emoji: '💆',
    name: 'Hair Transplant (FUE)',
    description: 'Follicular Unit Extraction utilizing pain-free micrografts for extremely dense, organic-looking, and lifelong hair restoration.',
    priceRange: '₹40,000–₹1,20,000'
  },
  {
    id: 4,
    emoji: '💉',
    name: 'PRP Therapy',
    description: 'Autologous platelet-rich plasma treatments engineered to promote rapid cellular regeneration for scalp thinning and facial glowing.',
    priceRange: '₹3,000–₹8,000'
  },
  {
    id: 5,
    emoji: '✨',
    name: 'Chemical Peel',
    description: 'Medical exfoliation employing targeted AHA/BHA cocktails that wipe out hyperpigmentation and yield pristine, glass-like skin quality.',
    priceRange: '₹2,000–₹6,000'
  },
  {
    id: 6,
    emoji: '🌿',
    name: 'Laser Hair Removal',
    description: 'Advanced dual-wavelength cooling lasers providing permanent hair reduction across premium bodily and facial zones.',
    priceRange: '₹1,500–₹12,000'
  },
  {
    id: 7,
    emoji: '🩺',
    name: 'Acne Treatment',
    description: 'Clinically advanced, multi-modal management of active vulgar lesions, inflammatory outbreaks, and early erythema scars.',
    priceRange: '₹1,000–₹5,000'
  },
  {
    id: 8,
    emoji: '🌸',
    name: 'Anti-Aging Treatment',
    description: 'Strategic botox, premium fillers, and collagen induction to sculpt facial parameters, reduce wrinkles, and restore hydration.',
    priceRange: '₹8,000–₹30,000'
  },
  {
    id: 9,
    emoji: '🎯',
    name: 'Pigmentation Treatment',
    description: 'Custom pigment lasers, deep depigmenting masks, and specialized medical protocols to eradicate stubborn melasma and sun damage.',
    priceRange: '₹2,500–₹8,000'
  },
  {
    id: 10,
    emoji: '🩹',
    name: 'Vitiligo Treatment',
    description: 'Specialized phototherapy guidelines, targeted topical immunomodulators, and cutting-edge surgery for localized depigmention.',
    priceRange: '₹1,500–₹6,000'
  },
  {
    id: 11,
    emoji: '💫',
    name: 'Mesotherapy',
    description: 'Cellular micro-infusions of customized vitamin cocktails, plant extracts, and hyaluronic acid for skin and follicle nourishment.',
    priceRange: '₹3,000–₹9,000'
  },
  {
    id: 12,
    emoji: '🧴',
    name: 'Medical Facial',
    description: 'Therapeutic extraction, vortex exfoliation, and custom dermaceutical infusions mapped specifically for customized medical facials.',
    priceRange: '₹1,500–₹4,000'
  }
];

export const patientReviews: ReviewItem[] = [
  {
    id: 1,
    name: 'Pooja Meena',
    stars: 5,
    text: "I recently got a laser treatment done on my skin, and I'm honestly so happy with the results! The procedure was quick, comfortable, and the staff was very professional.",
    initials: 'PM'
  },
  {
    id: 2,
    name: 'Neeraj Sahu',
    stars: 5,
    text: "Amazing result, polite doctor, clean clinic and very effective treatment, highly recommend.",
    initials: 'NS'
  },
  {
    id: 3,
    name: 'Vipin Chouhan',
    stars: 5,
    text: "Best derma logic, Dr. Ankit Jain Bhopal. Best result, CO2 laser. Good nature staff. All staff are very cooperative.",
    initials: 'VC'
  },
  {
    id: 4,
    name: 'Bewafa FF',
    stars: 5,
    text: "Clinic is very good. Staff is also very cooperative, you can visit if you have any query regarding hair.",
    initials: 'BF'
  },
  {
    id: 5,
    name: 'Priyansh Jain',
    stars: 5,
    text: "Good hospitality and supportive staff. Treatment results are amazing.",
    initials: 'PJ'
  }
];
