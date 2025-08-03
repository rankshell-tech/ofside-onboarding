'use client';

import React, { useState } from 'react';
import Header from '@/components/layout/Header';
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

    // Address & Contact
    fullAddress: '',
    city: '',
    state: '',
    pincode: '',
    latitude: '',
    longitude: '',
    contactPersonName: '',
    contactPhone: '',
    contactEmail: '',

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

    // Pricing & Availability
    slotDuration: '',
    pricePerSlot: '',
    startTime: '',
    endTime: '',
    availableDays: [] as string[]
  });

  const steps = [
    { title: 'Basic Details', icon: Building, color: 'from-[#ffe100] to-[#ffed4e]' },
    { title: 'Address & Contact', icon: MapPin, color: 'from-blue-500 to-blue-600' },
    { title: 'Amenities', icon: Plus, color: 'from-green-500 to-green-600' },
    { title: 'Venue Gallery', icon: Camera, color: 'from-purple-500 to-purple-600' },
    { title: 'Court Details', icon: Building, color: 'from-orange-500 to-orange-600' },
    { title: 'Pricing & Availability', icon: DollarSign, color: 'from-red-500 to-red-600' }
  ];

  const venueTypes = ['Turf', 'Stadium', 'Court', 'Ground', 'Complex'];
  const sportsOptions = ['Football', 'Cricket', 'Basketball', 'Tennis', 'Badminton', 'Volleyball', 'Swimming', 'Hockey'];
  const amenitiesOptions = ['Parking', 'Washroom', 'Drinking Water', 'Seating Area', 'Changing Room', 'Cafeteria', 'WiFi', 'First Aid', 'Equipment Rental', 'Locker Room'];
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Handle form submission
  };

  const isStepValid = (stepIndex: number) => {
    switch (stepIndex) {
      case 0: // Basic Details
        return formData.venueName && formData.venueType && formData.sportsOffered.length > 0 && formData.description;
      case 1: // Address & Contact
        return formData.fullAddress && formData.city && formData.state && formData.pincode && formData.contactPersonName && formData.contactPhone && formData.contactEmail;
      case 2: // Amenities
        return true; // Optional step
      case 3: // Gallery
        return true; // Optional step
      case 4: // Court Details
        return formData.courtName && formData.courtSportType && formData.surfaceType;
      case 5: // Pricing & Availability
        return formData.slotDuration && formData.pricePerSlot && formData.startTime && formData.endTime && formData.availableDays.length > 0;
      default:
        return false;
    }
  };

  const renderStepContent = () => {
    const currentStepData = steps[currentStep];
    const IconComponent = currentStepData.icon;

    switch (currentStep) {
      case 0: // Basic Details
        return (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Venue Name *
                </label>
                <input
                  type="text"
                  value={formData.venueName}
                  onChange={(e) => setFormData({...formData, venueName: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ffe100] focus:border-transparent transition-all"
                  placeholder="Enter your venue name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Venue Type *
                </label>
                <select
                  value={formData.venueType}
                  onChange={(e) => setFormData({...formData, venueType: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ffe100] focus:border-transparent transition-all"
                  required
                >
                  <option value="">Select venue type</option>
                  {venueTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div className="lg:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Sports Offered *
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {sportsOptions.map(sport => (
                    <label key={sport} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer transition-all">
                      <input
                        type="checkbox"
                        checked={formData.sportsOffered.includes(sport)}
                        onChange={() => handleMultiSelect('sportsOffered', sport)}
                        className="w-4 h-4 text-[#ffe100] border-gray-300 rounded focus:ring-[#ffe100]"
                      />
                      <span className="text-sm font-medium text-gray-700">{sport}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ffe100] focus:border-transparent transition-all resize-none"
                  placeholder="Describe your venue, facilities, and what makes it special..."
                  required
                />
              </div>

              <div className="lg:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Venue Logo
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-[#ffe100] transition-all">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">Upload your venue logo</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload('venueLogo', e.target.files)}
                    className="hidden"
                    id="logo-upload"
                  />
                  <label htmlFor="logo-upload" className="btn-primary cursor-pointer">
                    Choose File
                  </label>
                  {formData.venueLogo && (
                    <p className="text-sm text-green-600 mt-2">✓ {formData.venueLogo.name}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        );

      case 1: // Address & Contact
        return (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="lg:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Full Address *
                </label>
                <textarea
                  value={formData.fullAddress}
                  onChange={(e) => setFormData({...formData, fullAddress: e.target.value})}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                  placeholder="Enter complete address with landmarks"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  City *
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({...formData, city: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Enter city"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  State *
                </label>
                <input
                  type="text"
                  value={formData.state}
                  onChange={(e) => setFormData({...formData, state: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Enter state"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Pincode *
                </label>
                <input
                  type="text"
                  value={formData.pincode}
                  onChange={(e) => setFormData({...formData, pincode: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Enter pincode"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Latitude
                </label>
                <input
                  type="text"
                  value={formData.latitude}
                  onChange={(e) => setFormData({...formData, latitude: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="e.g., 19.0760"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Longitude
                </label>
                <input
                  type="text"
                  value={formData.longitude}
                  onChange={(e) => setFormData({...formData, longitude: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="e.g., 72.8777"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Contact Person Name *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={formData.contactPersonName}
                    onChange={(e) => setFormData({...formData, contactPersonName: e.target.value})}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Enter contact person name"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Phone Number *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="tel"
                    value={formData.contactPhone}
                    onChange={(e) => setFormData({...formData, contactPhone: e.target.value})}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Enter phone number"
                    required
                  />
                </div>
              </div>

              <div className="lg:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    value={formData.contactEmail}
                    onChange={(e) => setFormData({...formData, contactEmail: e.target.value})}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Enter email address"
                    required
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 2: // Amenities
        return (
          <div className="space-y-8">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {amenitiesOptions.map(amenity => (
                <label key={amenity} className="flex items-center space-x-3 p-4 border border-gray-200 rounded-xl hover:bg-green-50 hover:border-green-300 cursor-pointer transition-all">
                  <input
                    type="checkbox"
                    checked={formData.amenities.includes(amenity)}
                    onChange={() => handleMultiSelect('amenities', amenity)}
                    className="w-4 h-4 text-green-500 border-gray-300 rounded focus:ring-green-500"
                  />
                  <span className="text-sm font-medium text-gray-700">{amenity}</span>
                </label>
              ))}
            </div>
          </div>
        );

      case 3: // Gallery
        return (
          <div className="space-y-8">
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-purple-500 transition-all mb-6">
              <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">Upload multiple images of your venue</p>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => handleFileUpload('galleryImages', e.target.files)}
                className="hidden"
                id="gallery-upload"
              />
              <label htmlFor="gallery-upload" className="btn-primary cursor-pointer">
                Choose Images
              </label>
            </div>

            {formData.galleryImages.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {formData.galleryImages.map((file, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`Gallery ${index + 1}`}
                      className="w-full h-32 object-cover rounded-xl"
                    />
                    <button
                      type="button"
                      onClick={() => removeGalleryImage(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 4: // Court Details
        return (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Court Name *
                </label>
                <input
                  type="text"
                  value={formData.courtName}
                  onChange={(e) => setFormData({...formData, courtName: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  placeholder="e.g., Court A, Main Ground"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Sport Type *
                </label>
                <select
                  value={formData.courtSportType}
                  onChange={(e) => setFormData({...formData, courtSportType: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  required
                >
                  <option value="">Select sport type</option>
                  {sportsOptions.map(sport => (
                    <option key={sport} value={sport}>{sport}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Surface Type *
                </label>
                <select
                  value={formData.surfaceType}
                  onChange={(e) => setFormData({...formData, surfaceType: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  required
                >
                  <option value="">Select surface type</option>
                  {surfaceTypes.map(surface => (
                    <option key={surface} value={surface}>{surface}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Court Size
                </label>
                <input
                  type="text"
                  value={formData.courtSize}
                  onChange={(e) => setFormData({...formData, courtSize: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  placeholder="e.g., 100x60 feet, Standard size"
                />
              </div>

              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                <span className="text-sm font-semibold text-gray-700">Indoor Venue</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isIndoor}
                    onChange={(e) => setFormData({...formData, isIndoor: e.target.checked})}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                <span className="text-sm font-semibold text-gray-700">Lighting Available</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.hasLighting}
                    onChange={(e) => setFormData({...formData, hasLighting: e.target.checked})}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                </label>
              </div>
            </div>
          </div>
        );

      case 5: // Pricing & Availability
        return (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Slot Duration (minutes) *
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="number"
                    value={formData.slotDuration}
                    onChange={(e) => setFormData({...formData, slotDuration: e.target.value})}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                    placeholder="e.g., 60"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Price Per Slot (₹) *
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="number"
                    value={formData.pricePerSlot}
                    onChange={(e) => setFormData({...formData, pricePerSlot: e.target.value})}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                    placeholder="e.g., 500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Start Time *
                </label>
                <input
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => setFormData({...formData, startTime: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  End Time *
                </label>
                <input
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => setFormData({...formData, endTime: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                  required
                />
              </div>

              <div className="lg:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Available Days *
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
                  {daysOfWeek.map(day => (
                    <label key={day} className="flex items-center space-x-2 p-3 border border-gray-200 rounded-xl hover:bg-red-50 hover:border-red-300 cursor-pointer transition-all">
                      <input
                        type="checkbox"
                        checked={formData.availableDays.includes(day)}
                        onChange={() => handleMultiSelect('availableDays', day)}
                        className="w-4 h-4 text-red-500 border-gray-300 rounded focus:ring-red-500"
                      />
                      <span className="text-sm font-medium text-gray-700">{day.slice(0, 3)}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="h-screen overflow-hidden flex flex-col lg:flex-row">
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />
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
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="w-full lg:w-2/3 bg-gray-100 overflow-y-auto p-6" ref={rightRef}>
          <div className="mb-12">
              <div className="flex flex-wrap lg:flex-nowrap gap-4 items-center justify-between mb-8">
                {steps.map((step, index) => (
                  <React.Fragment key={index}>
                    <div className="flex flex-col items-center min-w-[70px]">
                      <div
                        className={`flex items-center justify-center w-10 h-10 rounded-full border-2 shadow transition-all duration-300
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
                          <Check className="w-5 h-5" />
                        ) : (
                          React.createElement(step.icon, { className: "w-5 h-5" })
                        )}
                      </div>
                      <span
                        className={`mt-2 text-xs font-medium text-center transition-all duration-200 ${
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
                <div className="px-6 py-6 bg-gray-50 border-t border-gray-100 flex flex-row items-center justify-between space-y-0 gap-2">
                  <button
                  type="button"
                  onClick={prevStep}
                  disabled={currentStep === 0}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all ${
                    currentStep === 0
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                  >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Back</span>
                  </button>

                  <div className="text-sm text-gray-500 flex-shrink-0">
                  Step {currentStep + 1} of {steps.length}
                  </div>

                  {currentStep === steps.length - 1 ? (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="bg-gradient-to-r from-[#ffe100] to-[#ffed4e] hover:from-[#e6cb00] hover:to-[#e6d43f] text-black font-bold py-3 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center space-x-2"
                  >
                    <span>Submit for Review</span>
                    <Check className="w-4 h-4" />
                  </button>
                  ) : (
                  <button
                    type="button"
                    onClick={nextStep}
                    disabled={!isStepValid(currentStep)}
                    className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all ${
                    isStepValid(currentStep)
                      ? `bg-gradient-to-r ${steps[currentStep].color} text-white hover:shadow-lg transform hover:scale-105`
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
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
                  Your venue will be reviewed within 24-48 hours and you'll be notified via email.
                </p>
              </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}