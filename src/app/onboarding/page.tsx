'use client';

import React, { useState } from 'react';
import { Upload, X, Plus, MapPin, Phone, Mail, User, Building, Camera, Clock, DollarSign, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { useRef } from 'react';


export default function VenueOnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const rightRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({
    // Basic Details
    venueName: '',
    venueType: '',
    sportsOffered: [] as string[],
    description: '',
    venueLogo: null as File | null,
    is24HoursOpen: false,

    // Address & Contact
    shopNo: '',
    floorTower: '',
    areaSectorLocality: '',
    city: '',
    state: '',
    pincode: '',
    latitude: '',
    longitude: '',
    contactPersonName: '',
    contactPhone: '',
    contactEmail: '',
    ownerName: '',
    ownerPhone: '',
    ownerEmail: '',

    // Amenities
    amenities: [] as string[],

    // Gallery
    galleryImages: [] as File[],

    // Court Details
    courtName: '',
    courtSportType: '',
    surfaceType: '',
    courtSize: '',
    isIndoor: false,
    hasLighting: false,
    courtImages: [] as File[],
    courtSlotDuration: '',
    courtMaxPeople: '',
    courtPricePerSlot: '',
    courtPeakEnabled: false,
    courtPeakDays: [] as string[],
    courtPeakStart: '',
    courtPeakEnd: '',
    courtPeakPricePerSlot: '',

    // Pricing & Availability
    slotDuration: '',
    pricePerSlot: '',
    startTime: '',
    endTime: '',
    availableDays: [] as string[],
    declarationAgreed: false,
  });


//  const [formData, setFormData] = useState(
//   {
//       venueName: 'Sports Arena',
//       venueType: 'Stadium',
//       sportsOffered: ['Football', 'Cricket'],
//       description: 'A premium sports venue with world-class facilities.',
//       venueLogo: null,
//       is24HoursOpen: true,
//       shopNo: '12A',
//       floorTower: 'Tower 2',
//       areaSectorLocality: 'Sector 45',
//       city: 'New Delhi',
//       state: 'Delhi',
//       pincode: '110045',
//       latitude: '28.6139',
//       longitude: '77.2090',
//       contactPersonName: 'John Doe',
//       contactPhone: '9876543210',
//       contactEmail: 'john@sportsarena.com',
//       ownerName: 'Jane Smith',
//       ownerPhone: '9123456789',
//       ownerEmail: 'jane@sportsarena.com',
//       amenities: ['WiFi', 'Flood lights', 'Washroom / Restroom'],
//       galleryImages: [],
//       courtName: 'Main Court',
//       courtSportType: 'Football',
//       surfaceType: 'Artificial Turf',
//       courtSize: 'Standard',
//       isIndoor: false,
//       hasLighting: true,
//       courtImages: [],
//       courtSlotDuration: '2',
//       courtMaxPeople: '15',
//       courtPricePerSlot: '1200',
//       courtPeakEnabled: true,
//       courtPeakDays: ['Saturday', 'Sunday'],
//       courtPeakStart: '18:00',
//       courtPeakEnd: '21:00',
//       courtPeakPricePerSlot: '1500',
//       slotDuration: '2',
//       pricePerSlot: '1200',
//       startTime: '06:00',
//       endTime: '23:59',
//       availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
//       declarationAgreed: true,
//     }

//  )

  const requiredFields = [
    'venueName',
    'description',
    'startTime',
    'endTime',
    'availableDays',
    'shopNo',
    'areaSectorLocality',
    'city',
    'pincode',
    'contactPersonName',
    'contactPhone',
    'contactEmail',
    'ownerName',
    'ownerPhone',
    'ownerEmail',
    'courtName',
    'surfaceType',
    'courtSportType',
    'courtSlotDuration',
    'courtMaxPeople',
    'courtPricePerSlot',
    'courtImages',
    'slotDuration',
    'pricePerSlot',
    'declarationAgreed'
  ];

  const [touched, setTouched] = useState<Record<string, boolean>>(
    Object.fromEntries(requiredFields.map(field => [field, false]))
  );

  const handleTouched = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const handleGoToHome = () => {
    // Redirect to home page
    window.location.href = '/';
  }
  const steps = [
    { title: 'Basic Details', icon: Building, color: 'from-[#ffe100] to-[#ffed4e]' },
    { title: 'Address & Contact', icon: MapPin, color: 'from-blue-500 to-blue-600' },
    { title: 'Amenities', icon: Plus, color: 'from-green-500 to-green-600' },
    { title: 'Court Details', icon: Building, color: 'from-orange-500 to-orange-600' },
    { title: 'Declaration', icon: Check, color: 'from-red-500 to-red-600' }
  ];

  const venueTypes = ['Turf', 'Stadium', 'Court', 'Ground', 'Complex'];
  const sportsOptions = ['Football', 'Cricket', 'Basketball', 'Tennis', 'Badminton', 'Volleyball', 'Swimming', 'Hockey'];
  const amenitiesOptions = ['WiFi','Flood lights', 'Washroom / Restroom', 'Changing Room', 'Drinking Water', 'Artificial Grass', 'Natural Grass', 'Bike/Car Parking',  'Mobile Charging','Showers/Steam', 'Match.refree', 'Warm-up track','Rental Equipment', 'First Aid','Locker Room', 'Seating Area', 'Cafeteria','Coaching']
    
  const surfaceTypes = ['Natural Grass', 'Artificial Turf', 'Concrete', 'Wooden', 'Synthetic', 'Clay'];
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const handleMultiSelect = <T extends keyof typeof formData>(
    field: T,
    value: string
  ) => {
    setFormData(prev => {
      // Only allow multi-select on fields that are string arrays
      if (
        field === 'sportsOffered' ||
        field === 'amenities' ||
        field === 'availableDays'
      ) {
        const arr = prev[field] as string[];
        return {
          ...prev,
          [field]: arr.includes(value)
            ? arr.filter((item) => item !== value)
            : [...arr, value]
        };
      }
      return prev;
    });
  };

  const handleFileUpload = (field: string, files: FileList | null) => {
    if (!files) return;

    if (field === 'venueLogo') {
      setFormData(prev => ({ ...prev, venueLogo: files[0] }));
    } else if (field === 'galleryImages') {
      setFormData(prev => ({
        ...prev,
        galleryImages: [...prev.galleryImages, ...Array.from(files)]
      }));
    }
  };

  const removeGalleryImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      galleryImages: prev.galleryImages.filter((_, i) => i !== index)
    }));
  };

  const nextStep = () => {
    rightRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate submit, show popup
    setShowSuccessPopup(true);
    console.log('Form submitted:', formData);
  };

  const isStepValid = (stepIndex: number) => {
    switch (stepIndex) {
      case 0: // Basic Details
        return formData.venueName  && formData.description;
      case 1: // Address & Contact
        return formData.city && formData.pincode && formData.contactPersonName && formData.contactPhone && formData.contactEmail;
      case 2: // Amenities
        return true; // Optional step
     
      case 3: // Court Details
        return formData.courtName && formData.courtSportType;
      case 4: // Pricing & Availability
        return formData.slotDuration && formData.pricePerSlot && formData.startTime && formData.endTime && formData.availableDays.length > 0;
      default:
        return false;
    }
  };



  // Success Popup
  if (showSuccessPopup) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-yellow-100 via-white to-yellow-200 backdrop-blur-sm animate__animated animate__fadeIn faster">
        <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-md w-full text-center border-4 border-yellow-200 relative animate__animated animate__zoomIn animate__faster">
          <div className="absolute -top-10 left-1/2 transform -translate-x-1/2">
            <div className="bg-gradient-to-r from-[#ffe100] to-[#ffed4e] rounded-full p-4 shadow-lg border-2 border-yellow-300 animate__animated animate__bounceIn">
              <Check className="w-12 h-12 text-green-600" />
            </div>
          </div>
          <h2 className="text-3xl font-extrabold mb-3 mt-8 text-gray-900 drop-shadow-lg">Venue Submitted!</h2>
          <p className="text-lg text-gray-700 mb-8 font-medium">
            Your venue details have been submitted for review.<br />
            <span className="text-yellow-700 font-semibold">
              Our executive will connect with you within the next 24-48 hours.
            </span>
          </p>
          <button
            className="bg-gradient-to-r from-[#ffe100] to-[#ffed4e] text-black font-bold py-3 px-8 rounded-xl shadow-lg hover:scale-105 hover:shadow-2xl transition-all duration-200 text-lg"
            onClick={() => handleGoToHome()}
          >
            Close
          </button>
        </div>
      </div>
    );
  }
  const renderStepContent = () => {
    const currentStepData = steps[currentStep];
    const IconComponent = currentStepData.icon;

    switch (currentStep) {
      case 0: // Basic Details
        // Validation logic
        const errors: Record<string, string> = {};
        if (!formData.venueName.trim()) errors.venueName = "Venue name is required.";
        if (!formData.description.trim()) errors.description = "Description is required.";
        if (formData.availableDays.length === 0) errors.availableDays = "Select at least one operational day.";
        // Track if user has interacted with fields
 

        if (!formData.is24HoursOpen) {
          if (!formData.startTime?.trim()) errors.startTime = "Start time is required.";
          if (!formData.endTime?.trim()) errors.endTime = "End time is required.";
        }

        return (
          <div className="space-y-8">
            <div className="grid grid-cols-1 gap-8">
              <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Venue Name *
          </label>
          <input
            type="text"
            value={formData.venueName}
            onChange={(e) => {
              setFormData({ ...formData, venueName: e.target.value });
              handleTouched('venueName');
            }}
            onBlur={() => handleTouched('venueName')}
            className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ffe100] focus:border-transparent transition-all text-gray-900 text-gray-700 ${
              errors.venueName && touched.venueName && !formData.venueName.trim() ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Enter your venue name"
            required
          />
          {errors.venueName && touched.venueName && !formData.venueName.trim() && (
            <span className="text-xs text-red-600 mt-1 block">{errors.venueName}</span>
          )}
              </div>

              <div className="lg:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Description *
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => {
              setFormData({ ...formData, description: e.target.value });
              handleTouched('description');
            }}
            onBlur={() => handleTouched('description')}
            rows={4}
            className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ffe100] focus:border-transparent transition-all resize-none text-gray-700 ${
              errors.description && touched.description && !formData.description.trim() ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Describe your venue, facilities, and what makes it special..."
            required
          />
          {errors.description && touched.description && !formData.description.trim() && (
            <span className="text-xs text-red-600 mt-1 block">{errors.description}</span>
          )}
              </div>
              <div className="lg:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Select the operational days *
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {daysOfWeek.map(day => (
              <label key={day} className="flex items-center space-x-2 p-3 border border-gray-200 rounded-xl hover:bg-red-50 hover:border-red-300 cursor-pointer transition-all">
                <input
            type="checkbox"
            checked={formData.availableDays.includes(day)}
            onChange={() => {
              handleMultiSelect('availableDays', day);
              handleTouched('availableDays');
            }}
            onBlur={() => handleTouched('availableDays')}
            className="w-4 h-4 text-red-500 border-gray-300 rounded focus:ring-red-500 text-gray-700"
                />
                <span className="text-sm font-medium text-gray-700">{day.slice(0, 3)}</span>
              </label>
            ))}
          </div>
          {errors.availableDays && touched.availableDays && formData.availableDays.length === 0 && (
            <span className="text-xs text-red-600 mt-1 block">{errors.availableDays}</span>
          )}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-4">
            <span className="text-sm font-semibold text-gray-700">Venue is open 24 hours?</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={!!formData.is24HoursOpen}
                onChange={e => {
            setFormData(prev => ({
              ...prev,
              is24HoursOpen: e.target.checked,
              startTime: e.target.checked ? '00:00' : prev.startTime,
              endTime: e.target.checked ? '23:59' : prev.endTime,
            }));
                }}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-400"></div>
            </label>
          </div>
              </div>
              <div className="flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row gap-6">
            <div className="flex-1">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Start Time *
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
            type="time"
            value={formData.startTime || '06:00'}
            onChange={(e) => {
              setFormData({ ...formData, startTime: e.target.value });
              handleTouched('startTime');
            }}
            onBlur={() => handleTouched('startTime')}
            className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all text-gray-700 ${
              errors.startTime && touched.startTime && !formData.is24HoursOpen && !formData.startTime?.trim() ? "border-red-500" : "border-gray-300"
            }`}
            required
            disabled={formData.is24HoursOpen}
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">Venue opening time (e.g., 06:00)</p>
              {errors.startTime && touched.startTime && !formData.is24HoursOpen && !formData.startTime?.trim() && (
                <span className="text-xs text-red-600 mt-1 block">{errors.startTime}</span>
              )}
            </div>

            <div className="flex-1">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                End Time *
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
            type="time"
            value={formData.endTime || '22:00'}
            onChange={(e) => {
              setFormData({ ...formData, endTime: e.target.value });
              handleTouched('endTime');
            }}
            onBlur={() => handleTouched('endTime')}
            className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all text-gray-700 ${
              errors.endTime && touched.endTime && !formData.is24HoursOpen && !formData.endTime?.trim() ? "border-red-500" : "border-gray-300"
            }`}
            required
            disabled={formData.is24HoursOpen}
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">Venue closing time (e.g., 22:00)</p>
              {errors.endTime && touched.endTime && !formData.is24HoursOpen && !formData.endTime?.trim() && (
                <span className="text-xs text-red-600 mt-1 block">{errors.endTime}</span>
              )}
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-700 mb-6">
              <span className="font-bold">Note:</span> Your Venue profile details will help attract users to your Venue. Please fill correct details of your venue/turf/ground.
            </p>
          </div>
              </div>
            </div>
          </div>
        );
      
      case 1: // Address & Contact
        // Validation logic
        const addressErrors: Record<string, string> = {};
        if (!formData.shopNo.trim()) addressErrors.shopNo = "Shop/Building no. is required.";
        if (!formData.areaSectorLocality.trim()) addressErrors.areaSectorLocality = "Area/Sector/Locality is required.";
        if (!formData.city.trim()) addressErrors.city = "City is required.";
        if (!formData.pincode.trim()) addressErrors.pincode = "Pincode is required.";
        if (!formData.contactPersonName.trim()) addressErrors.contactPersonName = "Contact person name is required.";
        if (!formData.contactPhone.trim()) addressErrors.contactPhone = "Contact phone is required.";
        if (!formData.contactEmail.trim()) addressErrors.contactEmail = "Contact email is required.";
        if (!formData.ownerName.trim()) addressErrors.ownerName = "Owner name is required.";
        if (!formData.ownerPhone.trim()) addressErrors.ownerPhone = "Owner phone is required.";
        if (!formData.ownerEmail.trim()) addressErrors.ownerEmail = "Owner email is required.";

        // Simple email and phone validation (can be improved)
        if (formData.contactEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactEmail)) {
          addressErrors.contactEmail = "Enter a valid email address.";
        }
        if (formData.ownerEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.ownerEmail)) {
          addressErrors.ownerEmail = "Enter a valid email address.";
        }
        if (formData.contactPhone && !/^\d{10}$/.test(formData.contactPhone)) {
          addressErrors.contactPhone = "Enter a valid 10-digit phone number.";
        }
        if (formData.ownerPhone && !/^\d{10}$/.test(formData.ownerPhone)) {
          addressErrors.ownerPhone = "Enter a valid 10-digit phone number.";
        }
        if (formData.pincode && !/^\d{6}$/.test(formData.pincode)) {
          addressErrors.pincode = "Enter a valid 6-digit pincode.";
        }

        return (
          <div className="space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
          <div className="w-full">
            <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
          Shop no./ Building no. *
            </label>
            <input
          type="text"
          value={formData.shopNo}
          onChange={(e) => {
            setFormData({ ...formData, shopNo: e.target.value });
            handleTouched('shopNo');
          }}
          onBlur={() => handleTouched('shopNo')}
          className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-700 ${
            addressErrors.shopNo && touched.shopNo ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="Enter shop no./ building no."
          required
            />
            {addressErrors.shopNo && touched.shopNo && (
          <span className="text-xs text-red-600 mt-1 block">{addressErrors.shopNo}</span>
            )}
          </div>

          <div className="w-full">
            <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
          Floor/Tower (Optional)
            </label>
            <input
          type="text"
          value={formData.floorTower}
          onChange={(e) => setFormData({ ...formData, floorTower: e.target.value })}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-700"
          placeholder="Enter floor/tower"
            />
          </div>

          <div className="w-full">
            <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
          Area / Sector / Locality *
            </label>
            <input
          type="text"
          value={formData.areaSectorLocality}
          onChange={(e) => {
            setFormData({ ...formData, areaSectorLocality: e.target.value });
            handleTouched('areaSectorLocality');
          }}
          onBlur={() => handleTouched('areaSectorLocality')}
          className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-700 ${
            addressErrors.areaSectorLocality && touched.areaSectorLocality ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="Enter area/sector/locality"
          required
            />
            {addressErrors.areaSectorLocality && touched.areaSectorLocality && (
          <span className="text-xs text-red-600 mt-1 block">{addressErrors.areaSectorLocality}</span>
            )}
          </div>

          <div className="w-full">
            <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
          City *
            </label>
            <input
          type="text"
          value={formData.city}
          onChange={(e) => {
            setFormData({ ...formData, city: e.target.value });
            handleTouched('city');
          }}
          onBlur={() => handleTouched('city')}
          className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-700 ${
            addressErrors.city && touched.city ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="Enter city"
          required
            />
            {addressErrors.city && touched.city && (
          <span className="text-xs text-red-600 mt-1 block">{addressErrors.city}</span>
            )}
          </div>

          <div className="w-full">
            <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
          Any landmark area (Optional)
            </label>
            <input
          type="text"
          value={formData.state}
          onChange={(e) => setFormData({ ...formData, state: e.target.value })}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-700"
          placeholder="Enter state"
            />
          </div>

          <div className="w-full">
            <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
          Area pincode *
            </label>
            <input
          type="text"
          value={formData.pincode}
          onChange={(e) => {
            setFormData({ ...formData, pincode: e.target.value });
            handleTouched('pincode');
          }}
          onBlur={() => handleTouched('pincode')}
          className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-700 ${
            addressErrors.pincode && touched.pincode ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="Enter pincode"
          required
            />
            {addressErrors.pincode && touched.pincode && (
          <span className="text-xs text-red-600 mt-1 block">{addressErrors.pincode}</span>
            )}
          </div>

          <div className="col-span-1 sm:col-span-2">
            <p className="text-sm text-gray-700 mb-4 sm:mb-6">
          <span className="font-bold">Please note Users will see this address on Ofside</span>
            </p>
          </div>

          <div className="w-full">
            <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
          Contact Person Name *
            </label>
            <div className="relative">
          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={formData.contactPersonName}
            onChange={(e) => {
              setFormData({ ...formData, contactPersonName: e.target.value });
              handleTouched('contactPersonName');
            }}
            onBlur={() => handleTouched('contactPersonName')}
            className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-700 ${
              addressErrors.contactPersonName && touched.contactPersonName ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Enter contact person name"
            required
          />
            </div>
            {addressErrors.contactPersonName && touched.contactPersonName && (
          <span className="text-xs text-red-600 mt-1 block">{addressErrors.contactPersonName}</span>
            )}
          </div>

          <div className="w-full">
            <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
          Contact Person Phone Number *
            </label>
            <div className="relative">
          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="tel"
            value={formData.contactPhone}
            onChange={(e) => {
              setFormData({ ...formData, contactPhone: e.target.value });
              handleTouched('contactPhone');
            }}
            onBlur={() => handleTouched('contactPhone')}
            className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-700 ${
              addressErrors.contactPhone && touched.contactPhone ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Enter phone number"
            required
          />
            </div>
            {addressErrors.contactPhone && touched.contactPhone && (
          <span className="text-xs text-red-600 mt-1 block">{addressErrors.contactPhone}</span>
            )}
          </div>

          <div className="w-full">
            <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
          Contact Person Email Address *
            </label>
            <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="email"
            value={formData.contactEmail}
            onChange={(e) => {
              setFormData({ ...formData, contactEmail: e.target.value });
              handleTouched('contactEmail');
            }}
            onBlur={() => handleTouched('contactEmail')}
            className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-700 ${
              addressErrors.contactEmail && touched.contactEmail ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Enter email address"
            required
          />
            </div>
            {addressErrors.contactEmail && touched.contactEmail && (
          <span className="text-xs text-red-600 mt-1 block">{addressErrors.contactEmail}</span>
            )}
            <div className="mt-2">
          <span className="inline-block bg-yellow-100 text-gray-800 font-medium px-3 py-1 rounded">
            Booking confirmation emails will be sent to this address
          </span>
            </div>
          </div>

          <div className="w-full">
            <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
          Owner Name *
            </label>
            <div className="relative">
          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={formData.ownerName}
            onChange={(e) => {
              setFormData({ ...formData, ownerName: e.target.value });
              handleTouched('ownerName');
            }}
            onBlur={() => handleTouched('ownerName')}
            className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-700 ${
              addressErrors.ownerName && touched.ownerName ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Enter owner name"
            required
          />
            </div>
            {addressErrors.ownerName && touched.ownerName && (
          <span className="text-xs text-red-600 mt-1 block">{addressErrors.ownerName}</span>
            )}
          </div>

          <div className="w-full">
            <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
          Owner Phone Number *
            </label>
            <div className="relative">
          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="tel"
            value={formData.ownerPhone}
            onChange={(e) => {
              setFormData({ ...formData, ownerPhone: e.target.value });
              handleTouched('ownerPhone');
            }}
            onBlur={() => handleTouched('ownerPhone')}
            className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-700 ${
              addressErrors.ownerPhone && touched.ownerPhone ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Enter phone number"
            required
          />
            </div>
            {addressErrors.ownerPhone && touched.ownerPhone && (
          <span className="text-xs text-red-600 mt-1 block">{addressErrors.ownerPhone}</span>
            )}
          </div>

          <div className="w-full">
            <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
          Owner Email Address *
            </label>
            <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="email"
            value={formData.ownerEmail}
            onChange={(e) => {
              setFormData({ ...formData, ownerEmail: e.target.value });
              handleTouched('ownerEmail');
            }}
            onBlur={() => handleTouched('ownerEmail')}
            className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-700 ${
              addressErrors.ownerEmail && touched.ownerEmail ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Enter email address"
            required
          />
            </div>
            {addressErrors.ownerEmail && touched.ownerEmail && (
          <span className="text-xs text-red-600 mt-1 block">{addressErrors.ownerEmail}</span>
            )}
          </div>
        </div>
          </div>
        );

      case 2: // Amenities
        // Validation logic
        const amenitiesErrors: Record<string, string> = {};
        if (formData.amenities.length === 0 && touched.amenities) {
          amenitiesErrors.amenities = "Select at least one amenity.";
        }

        return (
          <div className="space-y-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {amenitiesOptions.map(amenity => {
        const amenityIcons: Record<string, React.ElementType> = {
          'WiFi': Upload,
          'Flood lights': Camera,
          'Washroom / Restroom': User,
          'Changing Room': User,
          'Drinking Water': Mail,
          'Artificial Grass': Building,
          'Natural Grass': Building,
          'Bike/Car Parking': MapPin,
          'Mobile Charging': Phone,
          'Showers/Steam': Camera,
          'Match.refree': Check,
          'Warm-up track': Clock,
          'Rental Equipment': Plus,
          'First Aid': X,
          'Locker Room': User,
          'Seating Area': ChevronRight,
          'Cafeteria': DollarSign,
          'Coaching': ChevronLeft,
        };
        const Icon = amenityIcons[amenity] || Plus;
        const checked = formData.amenities.includes(amenity);

        return (
          <label
        key={amenity}
        className={`flex flex-col items-center justify-center gap-2 p-4 border rounded-xl cursor-pointer transition-all
          ${checked ? 'bg-green-50 border-green-400 shadow' : 'bg-white border-gray-200 hover:bg-green-50 hover:border-green-300'}
        `}
        style={{ minHeight: 110 }}
          >
        <Icon className={`w-7 h-7 ${checked ? 'text-green-600' : 'text-gray-400'}`} />
        <span className="text-xs font-medium text-center text-gray-700">{amenity}</span>
        <input
          type="checkbox"
          checked={checked}
          onChange={() => {
            handleMultiSelect('amenities', amenity);
            handleTouched('amenities');
          }}
          className="mt-1 accent-green-500"
          style={{ width: 18, height: 18 }}
        />
          </label>
        );
          })}
        </div>
        {amenitiesErrors.amenities && (
          <span className="text-xs text-red-600 mt-2 block text-center">{amenitiesErrors.amenities}</span>
        )}
          </div>
        );

      case 3: // Court Details
        // Validation logic
        const courtErrors: Record<string, string> = {};
        if (!formData.courtName.trim() && touched.courtName) courtErrors.courtName = "Court name is required.";
        if (!formData.surfaceType.trim() && touched.surfaceType) courtErrors.surfaceType = "Surface type is required.";
        if (!formData.courtSportType.trim() && touched.courtSportType) courtErrors.courtSportType = "Sport type is required.";
        if (!formData.courtSlotDuration && touched.courtSlotDuration) courtErrors.courtSlotDuration = "Slot duration is required.";
        if (!formData.courtMaxPeople && touched.courtMaxPeople) courtErrors.courtMaxPeople = "Max booking per slot is required.";
        if ((!formData.courtPricePerSlot || Number(formData.courtPricePerSlot) <= 0) && touched.courtPricePerSlot) courtErrors.courtPricePerSlot = "Enter a valid price per slot.";
        if ((!formData.courtImages || formData.courtImages.length < 2) && touched.courtImages) courtErrors.courtImages = "At least 2 images are required.";
        if (formData.courtPeakEnabled) {
          if ((!formData.courtPeakDays || formData.courtPeakDays.length === 0) && touched.courtPeakDays) courtErrors.courtPeakDays = "Select at least one peak day.";
          if (!formData.courtPeakStart && touched.courtPeakStart) courtErrors.courtPeakStart = "Peak start time is required.";
          if (!formData.courtPeakEnd && touched.courtPeakEnd) courtErrors.courtPeakEnd = "Peak end time is required.";
          if ((!formData.courtPeakPricePerSlot || Number(formData.courtPeakPricePerSlot) <= 0) && touched.courtPeakPricePerSlot) courtErrors.courtPeakPricePerSlot = "Enter a valid peak price per slot.";
        }

        return (
          <div className="space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {/* Court Name */}
          <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Court Name *
        </label>
        <input
          type="text"
          value={formData.courtName}
          onChange={(e) => {
        setFormData({ ...formData, courtName: e.target.value });
        handleTouched('courtName');
          }}
          onBlur={() => handleTouched('courtName')}
          className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-gray-700 ${
        courtErrors.courtName ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="e.g., Court A, Main Ground"
          required
        />
        {courtErrors.courtName && (
          <span className="text-xs text-red-600 mt-1 block">{courtErrors.courtName}</span>
        )}
          </div>
          <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Surface Type *
        </label>
        <select
          value={formData.surfaceType}
          onChange={(e) => {
        setFormData({ ...formData, surfaceType: e.target.value });
        handleTouched('surfaceType');
          }}
          onBlur={() => handleTouched('surfaceType')}
          className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-gray-700 ${
        courtErrors.surfaceType ? "border-red-500" : "border-gray-300"
          }`}
          required
        >
          <option value="">Select surface type</option>
          {surfaceTypes.map(type => (
        <option key={type} value={type}>{type}</option>
          ))}
        </select>
        {courtErrors.surfaceType && (
          <span className="text-xs text-red-600 mt-1 block">{courtErrors.surfaceType}</span>
        )}
          </div>

          {/* Court Images Upload Section */}
          <div className="sm:col-span-2">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Court Images (Minimum 2 Images required, first is cover) *
        </label>
        <div className={`border-2 border-dashed rounded-xl p-8 text-center transition-all mb-4 ${
          courtErrors.courtImages ? "border-red-500" : "border-gray-300 hover:border-orange-500"
        }`}>
          <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-2">
        Please upload Minimum - 2 Maximum - 5 images of this court. The first image will be used as the cover photo.
          </p>
          <input
        type="file"
        accept="image/*"
        multiple
        onChange={(e) => {
          const files = e.target.files ? Array.from(e.target.files).slice(0, 5) : [];
          setFormData(prev => ({
        ...prev,
        courtImages: files
          }));
          handleTouched('courtImages');
        }}
        onBlur={() => handleTouched('courtImages')}
        className="hidden"
        id="court-images-upload"
          />
          <label htmlFor="court-images-upload" className="btn-primary cursor-pointer text-gray-700">
        Select Images
          </label>
        </div>
        {formData.courtImages && formData.courtImages.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {formData.courtImages.map((file: File, index: number) => (
          <div key={index} className="relative group">
        <img
          src={URL.createObjectURL(file)}
          alt={`Court ${index + 1}`}
          className={`w-full h-32 object-cover rounded-xl ${index === 0 ? 'border-4 border-orange-400' : ''}`}
        />
        <span className="absolute top-2 left-2 bg-orange-500 text-white text-xs px-2 py-1 rounded">
          {index === 0 ? 'Cover Photo' : `Image ${index + 1}`}
        </span>
        <button
          type="button"
          onClick={() => {
            setFormData(prev => ({
          ...prev,
          courtImages: prev.courtImages.filter((_, i) => i !== index)
            }));
            handleTouched('courtImages');
          }}
          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <X className="w-4 h-4" />
        </button>
          </div>
        ))}
          </div>
        )}
        {courtErrors.courtImages && (
          <span className="text-xs text-red-600 mt-1 block">{courtErrors.courtImages}</span>
        )}
        <p className="text-sm text-gray-700 mb-6">
          <span className="font-bold">Note:</span> Your Venue profile image will help attract users to your Venue. Please upload a clear and high-quality picture showcasing your venue/turf/ground.
        </p>
          </div>

          {/* Sport Type */}
          <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Sport Type *
        </label>
        <select
          value={formData.courtSportType}
          onChange={(e) => {
        setFormData({ ...formData, courtSportType: e.target.value });
        handleTouched('courtSportType');
          }}
          onBlur={() => handleTouched('courtSportType')}
          className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-gray-700 ${
        courtErrors.courtSportType ? "border-red-500" : "border-gray-300"
          }`}
          required
        >
          <option value="">Select sport type</option>
          {sportsOptions.map(sport => (
        <option key={sport} value={sport}>{sport}</option>
          ))}
        </select>
        {courtErrors.courtSportType && (
          <span className="text-xs text-red-600 mt-1 block">{courtErrors.courtSportType}</span>
        )}
          </div>

          {/* Slot Duration (hours) */}
          <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Slot Duration (hours) *
        </label>
        <select
          value={formData.courtSlotDuration || '1'}
          onChange={(e) => {
        setFormData({ ...formData, courtSlotDuration: e.target.value });
        handleTouched('courtSlotDuration');
          }}
          onBlur={() => handleTouched('courtSlotDuration')}
          className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-gray-700 ${
        courtErrors.courtSlotDuration ? "border-red-500" : "border-gray-300"
          }`}
          required
        >
          {[1, 2, 3, 4, 5].map(hour => (
        <option key={hour} value={hour}>{hour} hour{hour > 1 ? 's' : ''}</option>
          ))}
        </select>
        {courtErrors.courtSlotDuration && (
          <span className="text-xs text-red-600 mt-1 block">{courtErrors.courtSlotDuration}</span>
        )}
          </div>

          {/* How many in 1 slot */}
          <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Max Booking Per Slot *
        </label>
        <select
          value={formData.courtMaxPeople || '10'}
          onChange={(e) => {
        setFormData({ ...formData, courtMaxPeople: e.target.value });
        handleTouched('courtMaxPeople');
          }}
          onBlur={() => handleTouched('courtMaxPeople')}
          className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-gray-700 ${
        courtErrors.courtMaxPeople ? "border-red-500" : "border-gray-300"
          }`}
          required
        >
          {[...Array(20)].map((_, i) => (
        <option key={i + 1} value={i + 1}>{i + 1}</option>
          ))}
        </select>
        {courtErrors.courtMaxPeople && (
          <span className="text-xs text-red-600 mt-1 block">{courtErrors.courtMaxPeople}</span>
        )}
          </div>

          {/* Pricing Per Slot */}
          <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Price Per Slot (₹) *
        </label>
        <input
          type="number"
          min={0}
          value={formData.courtPricePerSlot || '500'}
          onChange={(e) => {
        setFormData({ ...formData, courtPricePerSlot: e.target.value });
        handleTouched('courtPricePerSlot');
          }}
          onBlur={() => handleTouched('courtPricePerSlot')}
          className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-gray-700 ${
        courtErrors.courtPricePerSlot ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="e.g., 500"
          required
        />
        {courtErrors.courtPricePerSlot && (
          <span className="text-xs text-red-600 mt-1 block">{courtErrors.courtPricePerSlot}</span>
        )}
          </div>

          {/* Peak Hours Toggle */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <span className="text-sm font-semibold text-gray-700">Set different price for peak hours?</span>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
        type="checkbox"
        checked={!!formData.courtPeakEnabled}
        onChange={(e) => setFormData({ ...formData, courtPeakEnabled: e.target.checked })}
        className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
        </label>
          </div>

          {/* Peak Hours Details */}
          {formData.courtPeakEnabled && (
        <>
          <div className="sm:col-span-2">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Peak Days
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {daysOfWeek.map(day => (
        <label key={day} className="flex items-center space-x-2 p-3 border border-gray-200 rounded-xl hover:bg-orange-50 hover:border-orange-300 cursor-pointer transition-all">
          <input
            type="checkbox"
            checked={formData.courtPeakDays?.includes(day) || false}
            onChange={() => {
          setFormData(prev => {
            const arr = prev.courtPeakDays || [];
            return {
          ...prev,
          courtPeakDays: arr.includes(day)
            ? arr.filter((d: string) => d !== day)
            : [...arr, day]
            };
          });
          handleTouched('courtPeakDays');
            }}
            onBlur={() => handleTouched('courtPeakDays')}
            className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500 text-gray-700"
          />
          <span className="text-sm font-medium text-gray-700">{day.slice(0, 3)}</span>
        </label>
          ))}
        </div>
        {courtErrors.courtPeakDays && (
          <span className="text-xs text-red-600 mt-1 block">{courtErrors.courtPeakDays}</span>
        )}
          </div>
          <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Peak Hours (Select Range)
        </label>
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <input
        type="time"
        value={formData.courtPeakStart || ''}
        onChange={(e) =>
          setFormData({ ...formData, courtPeakStart: e.target.value })
        }
        onBlur={() => handleTouched('courtPeakStart')}
        className={`px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-gray-700 ${
          courtErrors.courtPeakStart ? "border-red-500" : "border-gray-300"
        }`}
        placeholder="Start"
          />
          <span className="mx-2 text-gray-500">to</span>
          <input
        type="time"
        value={formData.courtPeakEnd || ''}
        onChange={(e) =>
          setFormData({ ...formData, courtPeakEnd: e.target.value })
        }
        onBlur={() => handleTouched('courtPeakEnd')}
        className={`px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-gray-700 ${
          courtErrors.courtPeakEnd ? "border-red-500" : "border-gray-300"
        }`}
        placeholder="End"
          />
        </div>
        {courtErrors.courtPeakStart && (
          <span className="text-xs text-red-600 mt-1 block">{courtErrors.courtPeakStart}</span>
        )}
        {courtErrors.courtPeakEnd && (
          <span className="text-xs text-red-600 mt-1 block">{courtErrors.courtPeakEnd}</span>
        )}
        <p className="text-xs text-gray-500 mt-2">
          Example: 18:00 to 21:00 (24-hour format)
        </p>
          </div>
          <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Peak Hours Price Per Slot (₹)
        </label>
        <input
          type="number"
          min={0}
          value={formData.courtPeakPricePerSlot || ''}
          onChange={(e) => {
            setFormData({ ...formData, courtPeakPricePerSlot: e.target.value });
            handleTouched('courtPeakPricePerSlot');
          }}
          onBlur={() => handleTouched('courtPeakPricePerSlot')}
          className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-gray-700 ${
        courtErrors.courtPeakPricePerSlot ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="e.g., 700"
        />
        {courtErrors.courtPeakPricePerSlot && (
          <span className="text-xs text-red-600 mt-1 block">{courtErrors.courtPeakPricePerSlot}</span>
        )}
          </div>
        </>
          )}
        </div>
          </div>
        );

      case 4: // Declaration
        // Validation logic
        const declarationErrors: Record<string, string> = {};
        return (
          <div className="space-y-8">
        <div className="col-span-2">
          <h3 className="text-xl font-bold text-gray-700 text-center mb-4">Declaration & Consent</h3>
          <div className="mb-4">
            <span className="text-gray-800">
          I hereby certify that I am an authorized representative of <span className="font-semibold">{formData.venueName || '[Venue Name]'}</span>, and that all information provided in the Ofside onboarding form is true, complete, and accurate to the best of my knowledge. I understand that Ofside (powered by Rankshell – India’s ultimate sports ecosystem) will rely on these details to list and promote my venue.
            </span>
          </div>
          <div className="mb-4">
            <strong className="font-semibold text-gray-700">Details Provided:</strong>
            <ul className="list-disc ml-6 text-gray-800 mt-2 space-y-1">
          <li>Brand / Venue Name, Contact Number &amp; Email</li>
          <li>Owner’s Name &amp; Contact Details</li>
          <li>Venue Location &amp; Full Address</li>
          <li>Amenities Available</li>
          <li>Operational Days &amp; Timings</li>
          <li>Sports Offered</li>
          <li>Facility Images for Each Sport</li>
            </ul>
          </div>
          <div className="mb-4">
            <span className="text-gray-800">
          I understand that this declaration constitutes my formal consent and will be used to activate and manage my venue listing on the Ofside platform. I acknowledge that any false or misleading information may result in removal from the platform or other remedial action by Ofside.
            </span>
          </div>
          <div className="flex items-center mt-6">
            <input
          type="checkbox"
          id="declaration"
          className={`w-5 h-5 accent-black mr-2 ${declarationErrors.declarationAgreed ? "border-red-500" : ""}`}
          checked={formData.declarationAgreed}
          onChange={e => {
            setFormData(prev => ({
              ...prev,
              declarationAgreed: e.target.checked,
            }));
            handleTouched('declarationAgreed');
          }}
          onBlur={() => handleTouched('declarationAgreed')}
            />
            <label htmlFor="declaration" className="font-semibold text-gray-900">
          I agree and confirm the accuracy of the above information.
            </label>
          </div>
          {declarationErrors.declarationAgreed && (
            <span className="text-xs text-red-600 mt-2 block">{declarationErrors.declarationAgreed}</span>
          )}
        </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="h-screen overflow-hidden flex flex-col ">
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
     
      <div className="flex h-screen p-2">
        <div className="hidden lg:block lg:w-1/3 p-6 bg-theme-primary-light">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Header */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-[#ffe100] to-[#ffed4e] rounded-2xl mb-6 shadow-lg">
          <Building className="w-10 h-10 text-black" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">List Your Sports Venue</h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Join thousands of venue owners and start earning by listing your sports facility on Ofside
              </p>
            </div>
            {/* Extra Info */}
            <div className="mt-8 space-y-6 text-gray-700">
              <div className="flex items-center gap-3">
          <Check className="w-5 h-5 text-green-500" />
          <span>Get discovered by thousands of sports enthusiasts in your city.</span>
              </div>
              <div className="flex items-center gap-3">
          <Check className="w-5 h-5 text-green-500" />
          <span>Easy booking management and hassle-free payments.</span>
              </div>
              <div className="flex items-center gap-3">
          <Check className="w-5 h-5 text-green-500" />
          <span>Dedicated support team to help you grow your business.</span>
              </div>
              <div className="flex items-center gap-3">
          <Check className="w-5 h-5 text-green-500" />
          <span>No listing fees. Pay only when you get bookings.</span>
              </div>
            </div>
            <div className="mt-12 text-center">
              <span className="inline-block bg-gradient-to-r from-[#ffe100] to-[#ffed4e] text-black font-semibold px-6 py-2 rounded-xl shadow">
          Need help? <a href="mailto:support@ofside.in" className="underline">Contact Support</a>
              </span>
            </div>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="w-full lg:w-2/3 bg-gray-100 overflow-y-auto p-6" ref={rightRef}>
          <div className="mb-12">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
  {steps.map((step, index) => (
    <React.Fragment key={index}>
      <div className="flex flex-col items-center min-w-[40px] sm:min-w-[70px]">
        <div
          className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 shadow transition-all duration-300
            ${
              index < currentStep
                ? 'bg-green-500 border-green-500 text-white'
                : index === currentStep
                ? `bg-gradient-to-r ${step.color} border-transparent text-black scale-110 ring-2 ring-yellow-200`
                : 'bg-white border-gray-300 text-gray-400'
            }
          `}
        >
          {index < currentStep ? (
            <Check className="w-4 h-4 sm:w-5 sm:h-5" />
          ) : (
            React.createElement(step.icon, {
              className: 'w-4 h-4 sm:w-5 sm:h-5',
            })
          )}
        </div>

        {/* Step name only visible on sm and above */}
        <span
          className={`hidden sm:block mt-2 text-xs font-medium text-center transition-all duration-200 ${
            index === currentStep
              ? 'text-black'
              : index < currentStep
              ? 'text-green-600'
              : 'text-gray-400'
          }`}
        >
          {step.title}
        </span>
      </div>

      {/* Progress bar between steps */}
      {index < steps.length - 1 && (
        <div
          className={`flex-1 h-1 rounded transition-all duration-300 ${
            index < currentStep
              ? 'bg-green-500'
              : index === currentStep
              ? 'bg-gradient-to-r from-yellow-300 to-yellow-400'
              : 'bg-gray-300'
          }`}
        />
      )}
    </React.Fragment>
  ))}
</div>

              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                {/* Step Header */}
                <div className={`bg-gradient-to-r ${steps[currentStep].color} px-8 py-6`}>
                  <h2 className="text-2xl font-bold text-black flex items-center">
                    {React.createElement(steps[currentStep].icon, { className: "w-6 h-6 mr-3" })}
                    {steps[currentStep].title}
                  </h2>
                </div>

                {/* Step Content */}
                <div className="p-8 min-h-[400px]">
                    {renderStepContent()}
                </div>

                {/* Navigation Buttons */}
                <div
                  className={`px-4 py-4 sm:px-6 sm:py-6 bg-gray-50 border-t border-gray-100 flex ${
                  currentStep === 4 ? 'flex-col' : 'flex-row'
                  } items-center justify-center gap-2`}
                >
                    <button
                    type="button"
                    onClick={prevStep}
                    disabled={currentStep === 0}
                    className={`flex items-center space-x-2 px-4 py-2 sm:px-6 sm:py-3 rounded-xl font-medium transition-all justify-center ${
                      currentStep === 0
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                    } ${currentStep === 4 ? 'w-full' : 'w-full sm:w-auto'}`}
                    style={currentStep === 4 ? { width: '100%' } : { maxWidth: 160 }}
                    >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Back</span>
                    </button>

                  <div className="text-sm text-gray-500 flex-shrink-0 text-center" style={{ minWidth: 110 }}>
                    Step {currentStep + 1} of {steps.length}
                  </div>

                  {currentStep === steps.length - 1 ? (
                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={!formData.declarationAgreed}
                      className={`bg-gradient-to-r from-[#ffe100] to-[#ffed4e] text-black font-bold py-3 px-8 rounded-xl shadow-lg flex items-center space-x-3 w-full justify-center transition-all duration-200
                        ${formData.declarationAgreed
                          ? 'hover:from-[#e6cb00] hover:to-[#e6d43f] hover:shadow-xl transform hover:scale-105'
                          : 'opacity-60 cursor-not-allowed'
                        }
                      `}
                      style={{
                        fontSize: '1.15rem',
                        letterSpacing: '0.02em',
                        boxShadow: '0 4px 16px 0 rgba(255,225,0,0.10)',
                        border: '2px solid #ffe100',
                      }}
                    >
                      <Check className="w-5 h-5 mr-2" />
                      <span>Submit for Review</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={nextStep}
                      disabled={!isStepValid(currentStep)}
                      className={`flex items-center space-x-2 px-4 py-2 sm:px-6 sm:py-3 rounded-xl font-medium transition-all w-full sm:w-auto justify-center ${
                        isStepValid(currentStep)
                          ? `bg-gradient-to-r ${steps[currentStep].color} text-white hover:shadow-lg transform hover:scale-105`
                          : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      }`}
                      style={{ maxWidth: 160 }}
                    >
                      <span>Next</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Help Text */}
              <div className="text-center mt-8">
                <p className="text-gray-600">
                  Your venue will be reviewed within 24-48 hours and you will be notified via email.
                </p>
              </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}