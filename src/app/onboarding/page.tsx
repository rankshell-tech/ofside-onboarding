/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useJsApiLoader } from '@react-google-maps/api';
import React, { useEffect, useState } from "react";
import Image from "next/image";
import {
  Upload,
  X,
  Plus,
  MapPin,
  Phone,
  Mail,
  User,
  Building,
  Camera,
  Clock,
  DollarSign,
  ChevronLeft,
  ChevronRight,
  Check,
  Wifi, // <-- If not in lucide-react, keep Upload or similar
  Lightbulb,
  Droplets,
  Dumbbell,
  Car,
  Shield,
  Utensils,
} from "lucide-react";
import { useRef } from "react";
import imageCompression from "browser-image-compression";
const footballVideo = "./assets/football-playing-vertical.mp4";


import { Libraries } from '@googlemaps/js-api-loader';

const libraries: Libraries = ['places'];



export default function VenueOnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const rightRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    // Make every * bold and red in labels after render
    const interval = setTimeout(() => {
      document.querySelectorAll("label").forEach((label) => {
        label.innerHTML = label.innerHTML.replace(
          /\*/g,
          '<span style="color:red;font-weight:900">*</span>'
        );
      });
    }, 0);
    return () => clearTimeout(interval);
  }, [currentStep]);



  

  const [loading, setLoading] = useState(false);

  const [sameAsContact, setSameAsContact] = useState(false);



const [formData, setFormData] = useState({
  // Basic Details
  venueName: "",
  venueType: "",
  sportsOffered: [] as string[],
  description: "",
  venueLogo: null as File | null,
  is24HoursOpen: false,

  // Address & Contact
  shopNo: "",
  floorTower: "",
  areaSectorLocality: "",
  latitude: "",
  longitude: "",
  city: "",
  state: "",
  landmark: "",
  pincode: "",
  fullAddress: "",

  contactPersonName: "",
  contactPhone: "",
  contactEmail: "",
  ownerName: "",
  ownerPhone: "",
  ownerEmail: "",
  startTime: "",
  endTime: "",
  // Amenities
  amenities: [] as string[],

  availableDays: [] as string[],
  declarationAgreed: false,

  // Courts Array for multiple courts support
  courts: [
    {
      courtName: "",
      surfaceType: "",
      courtSportType: "",
      courtSlotDuration: "",
      courtMaxPeople: "",
      courtPricePerSlot: "",
      courtImages: {
        cover: null as File | null,
        logo: null as File | null,
        others: [] as File[],
      },
      courtPeakEnabled: false,
      courtPeakDays: [] as string[],
      courtPeakStart: "",
      courtPeakEnd: "",
      courtPeakPricePerSlot: "",
    },
  ],
});


    // const [formData, setFormData] = useState({
    //   // Basic Details
    //   venueName: "test" + Math.floor(Math.random() * 1000),
    //   venueType: "Turf",
    //   sportsOffered: [] as string[],
    //   description: "edesc",
    //   venueLogo: null as File | null,
    //   is24HoursOpen: false,

    //   // Address & Contact
    //   shopNo: "w",
    //   floorTower: "w",
    //   areaSectorLocality: "w",
    //   latitude: "12.9716",
    //   longitude: "77.5946",
    //   city: "Bangalore",
    //   state: "Karnataka",
    //   landmark: "Some Landmark",
    //   pincode: "787878",
    //   fullAddress: "",

    //   contactPersonName: "contact",
    //   contactPhone: "8989898989",
    //   contactEmail: "contact@gmail.com",
    //   ownerName: "owner@gmail.com",
    //   ownerPhone: "8989898989",
    //   ownerEmail: "owner@gmail.com",
    //   startTime: "",
    //   endTime: "",
    //   // Amenities
    //   amenities: [] as string[],

    //   availableDays: [] as string[],
    //   declarationAgreed: false,

    //   // Courts Array for multiple courts support
    //   courts: [
    //     {
    //       courtName: "Court 1",
    //       surfaceType: "Grass",
    //       courtSportType: "",
    //       courtSlotDuration: "",
    //       courtMaxPeople: "",
    //       courtPricePerSlot: "",
    //       courtImages: {
    //         cover: null as File | null,
    //         logo: null as File | null,
    //         others: [] as File[],
    //       },
    //       courtPeakEnabled: false,
    //       courtPeakDays: [] as string[],
    //       courtPeakStart: "",
    //       courtPeakEnd: "",
    //       courtPeakPricePerSlot: "",
    //     },
    //   ],
    // });



  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    libraries,
    region: 'IN',
    language: 'en-IN'
  });

  const [sessionToken, setSessionToken] = useState<google.maps.places.AutocompleteSessionToken>();
  const [businessResults, setBusinessResults] = useState<google.maps.places.AutocompletePrediction[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<google.maps.places.Place | null>(null);

  // Initialize session token
  useEffect(() => {
    if (isLoaded) {
      setSessionToken(new google.maps.places.AutocompleteSessionToken());
    }
  }, [isLoaded]);

  const fetchBusinessPredictions = async (input: string) => {
    if (!input.trim() || !window.google) return;
    
    try {
      const autocompleteService = new google.maps.places.AutocompleteService();
      
      // Use either locationBias OR locationRestriction, not both
      const request = {
        input,
        sessionToken,
        types: ['establishment'],
        componentRestrictions: { country: 'in' },
        // Choose one of these location parameters:
        locationBias: {
          center: { lat: 20.5937, lng: 78.9629 }, // Center of India
          radius: 2000000 // 2000km radius
        }
        // OR
        // locationRestriction: {
        //   north: 35.5087,
        //   south: 6.4627,
        //   east: 97.3956,
        //   west: 68.1097
        // }
      };

      const response = await autocompleteService.getPlacePredictions(request);
      if (response.predictions) {
        setBusinessResults(response.predictions);
      }
    } catch (error) {
      console.error('Autocomplete error:', error);
    }
  };

const handlePlaceSelect = async (placeId: string) => {
  if (!placeId || !window.google?.maps?.places) return;

  try {
    const mapDiv = document.createElement('div');
    const service = new window.google.maps.places.PlacesService(mapDiv);

    const request: google.maps.places.PlaceDetailsRequest = {
      placeId,
      fields: [
        'name',
        'formatted_address',
        'address_components',
        'geometry',
        'website',
        'international_phone_number'
      ],
      sessionToken,
    };

    service.getDetails(request, (place, status) => {
      if (status !== window.google.maps.places.PlacesServiceStatus.OK || !place) {
        console.error('Place details error:', status, place);
        return;
      }

      // Enhanced address component extractor
      const getComponent = (...types: string[]): string => {
        if (!place.address_components) return "";
        for (const type of types) {
          const component = place.address_components.find(c => 
            c.types?.includes(type)
          );
          if (component?.long_name) return component.long_name;
        }
        return "";
      };

      // Extract all address components in one pass
      const addressComponents = {
        shopNo: getComponent("street_number", "subpremise", "premise", "establishment") ||
               (place.address_components?.[0]?.long_name || ""),
        
        floorTower: getComponent("floor", "tower", "room"),
        
        areaSectorLocality: [
          getComponent("route"),
          getComponent("neighborhood"),
          getComponent("sublocality_level_3"),
          getComponent("sublocality_level_2"),
          getComponent("sublocality_level_1"),
          getComponent("political"),
          getComponent("premise")
        ].filter(Boolean)
         .filter((v, i, arr) => arr.indexOf(v) === i)
         .join(", "),
        
        city: getComponent(
          "locality", 
          "administrative_area_level_2", 
          "sublocality", 
          "postal_town"
        ),
        
        state: getComponent(
          "administrative_area_level_1", 
          "administrative_area_level_2"
        ),
        
        landmark: getComponent("landmark"),
        
        pincode: getComponent("postal_code", "postal_code_suffix")
      };

      setFormData(prev => ({
        ...prev,
        ...addressComponents,
        fullAddress: place.formatted_address || "",
        latitude: place.geometry?.location?.lat()?.toString() || "",
        longitude: place.geometry?.location?.lng()?.toString() || "",
        // Uncomment if needed:
        // businessName: place.name || "",
        // website: place.website || "",
        // phone: place.international_phone_number || ""
      }));

      setBusinessResults([]);
      setSessionToken(new window.google.maps.places.AutocompleteSessionToken());
    });
  } catch (error) {
    console.error('Place details error:', error);
    setSessionToken(new window.google.maps.places.AutocompleteSessionToken());
  }
};

  // Helper to extract address components
  const extractAddressComponents = (components: google.maps.places.AddressComponent[] | undefined) => {
    const result = {
      shopNo: '',
      areaSectorLocality: '',
      city: '',
      pincode: '',
      state: ''
    };

    components?.forEach(component => {
      if (component.types.includes('street_number')) {
        result.shopNo = component.longText || '';
      }
      if (component.types.includes('route')) {
        result.areaSectorLocality = component.longText || '';
      }
      if (component.types.includes('locality') || component.types.includes('sublocality')) {
        result.city = component.longText || '';
      }
      if (component.types.includes('postal_code')) {
        result.pincode = component.longText || '';
      }
      if (component.types.includes('administrative_area_level_1')) {
        result.state = component.longText || '';
      }
    });

    return result;
  };


  const requiredFields = [
    "venueName",
    "description",
    "startTime",
    "endTime",
    "availableDays",
    "shopNo",
    "areaSectorLocality",
    "city",
    "pincode",
    "contactPersonName",
    "contactPhone",
    "contactEmail",
    "ownerName",
    "ownerPhone",
    "ownerEmail",
    // Remove single court fields, handle via courts array
    "slotDuration",
    "pricePerSlot",
    "declarationAgreed",
  ];

  // For multiple courts, track touched for each court by index
  const courtFields = [
    "courtName",
    "surfaceType",
    "courtSportType",
    "courtSlotDuration",
    "courtMaxPeople",
    "courtPricePerSlot",
    "courtImages",
    "courtPeakEnabled",
    "courtPeakDays",
    "courtPeakStart",
    "courtPeakEnd",
    "courtPeakPricePerSlot",
  ];

  // touched for main form fields
  const [touched, setTouched] = useState<Record<string, boolean>>(
    Object.fromEntries(requiredFields.map((field) => [field, false]))
  );

  // touched for each court (array of objects)
  const [courtsTouched, setCourtsTouched] = useState<Record<string, boolean>[]>(
    formData.courts.map(() =>
      Object.fromEntries(courtFields.map((field) => [field, false]))
    )
  );

  // Add courts state and setCourts function
  const [courts, setCourts] = useState(formData.courts);

  // Validation logic for each court
  const courtsErrors: Record<number, Record<string, string>> = {};

  formData.courts.forEach((court, idx) => {
    const errors: Record<string, string> = {};
    if (!court.courtName.trim() && courtsTouched[idx]?.courtName)
      errors.courtName = "Court name is required.";

    if (!court.courtSportType.trim() && courtsTouched[idx]?.courtSportType)
      errors.courtSportType = "Sport type is required.";
    if (!court.courtSlotDuration && courtsTouched[idx]?.courtSlotDuration)
      errors.courtSlotDuration = "Slot duration is required.";
    if (!court.courtMaxPeople && courtsTouched[idx]?.courtMaxPeople)
      errors.courtMaxPeople = "Max booking per slot is required.";
    if (
      (!court.courtPricePerSlot || Number(court.courtPricePerSlot) <= 0) &&
      courtsTouched[idx]?.courtPricePerSlot
    )
      errors.courtPricePerSlot = "Enter a valid price per slot.";
    // Validate cover image
    if (
      !court.courtImages.cover &&
      courtsTouched[idx]?.courtImages
    ) {
      errors.courtImages = "Cover image is required.";
    }
    // Validate logo image
    if (
      !court.courtImages.logo &&
      courtsTouched[idx]?.courtImages
    ) {
      errors.courtImages = errors.courtImages
      ? errors.courtImages + " Logo/profile image is required."
      : "Logo/profile image is required.";
    }
    // Validate other images (optional, but you can require at least one if needed)
    // if (
    //   (!court.courtImages.others || court.courtImages.others.length === 0) &&
    //   courtsTouched[idx]?.courtImages
    // ) {
    //   errors.courtImages = errors.courtImages
    //     ? errors.courtImages + " At least one other image is required."
    //     : "At least one other image is required.";
    // }
    if (court.courtPeakEnabled) {
      if (
        (!court.courtPeakDays || court.courtPeakDays.length === 0) &&
        courtsTouched[idx]?.courtPeakDays
      )
        errors.courtPeakDays = "Select at least one peak day.";
      if (!court.courtPeakStart && courtsTouched[idx]?.courtPeakStart)
        errors.courtPeakStart = "Peak start time is required.";
      if (!court.courtPeakEnd && courtsTouched[idx]?.courtPeakEnd)
        errors.courtPeakEnd = "Peak end time is required.";
      if (
        (!court.courtPeakPricePerSlot ||
          Number(court.courtPeakPricePerSlot) <= 0) &&
        courtsTouched[idx]?.courtPeakPricePerSlot
      )
        errors.courtPeakPricePerSlot = "Enter a valid peak price per slot.";
    }
    courtsErrors[idx] = errors;
  });

  const handleCourtChange = (
    idx: number,
    field: string,
    value: string | boolean
  ) => {
    setFormData((prevFormData) => {
      const updatedCourts = prevFormData.courts.map((court, i) =>
        i === idx ? { ...court, [field]: value } : court
      );
      return {
        ...prevFormData,
        courts: updatedCourts,
      };
    });
  };

  const handleCourtFileChange = (idx: number, files: FileList | null) => {
    if (!files) return;
    setFormData((prev) => {
      const updatedCourts = prev.courts.map((court, i) => {
        if (i !== idx) return court;
        // Map files to cover, logo, others
        const fileArr = Array.from(files).slice(0, 5);
        return {
          ...court,
          courtImages: {
            cover: fileArr[0] || null,
            logo: fileArr[1] || null,
            others: fileArr.slice(2),
          },
        };
      });
      return {
        ...prev,
        courts: updatedCourts,
      };
    });
  };

  const handleRemoveCourtImage = (idx: number, imgIdx: number) => {
    setFormData((prev) => {
      const updatedCourts = prev.courts.map((court, i) => {
        if (i !== idx) return court;
        if (imgIdx === 0) {
          // Remove cover
          return {
            ...court,
            courtImages: {
              ...court.courtImages,
              cover: null,
            },
          };
        } else if (imgIdx === 1) {
          // Remove logo
          return {
            ...court,
            courtImages: {
              ...court.courtImages,
              logo: null,
            },
          };
        } else {
          // Remove from others (imgIdx - 2)
          const newOthers = [...court.courtImages.others];
          newOthers.splice(imgIdx - 2, 1);
          return {
            ...court,
            courtImages: {
              ...court.courtImages,
              others: newOthers,
            },
          };
        }
      });
      return {
        ...prev,
        courts: updatedCourts,
      };
    });
  };

  type CourtArrayField = "courtPeakDays";
  const handleCourtMultiSelect = (
    idx: number,
    field: CourtArrayField,
    value: string
  ) => {
    setCourts((prev) =>
      prev.map((court, i) =>
        i === idx
          ? {
              ...court,
              [field]: court[field].includes(value)
                ? court[field].filter((item) => item !== value)
                : [...court[field], value],
            }
          : court
      )
    );
  };

  const addCourt = () => {
    setFormData((prev) => ({
      ...prev,
      courts: [
      ...prev.courts,
      {
        courtName: "",
        surfaceType: "",
        courtSportType: "",
        courtSlotDuration: "",
        courtMaxPeople: "",
        courtPricePerSlot: "",
        courtImages: {
        cover: null as File | null,
        logo: null as File | null,
        others: [] as File[],
        },
        courtPeakEnabled: false,
        courtPeakDays: [] as string[],
        courtPeakStart: "",
        courtPeakEnd: "",
        courtPeakPricePerSlot: "",
      },
      ],
    }));
  };

  const removeCourt = (idx: number) => {
    const updated = formData.courts.filter((_, i) => i !== idx);
    setFormData((prevFormData) => ({
      ...prevFormData,
      courts: updated,
    }));
  };

  const compressImage = async (file: File): Promise<File> => {
    const options = {
      maxSizeMB: 0.3,
      maxWidthOrHeight: 1200,
      useWebWorker: true,
    };
    return await imageCompression(file, options);
  };

  // Sync courts with formData
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      courts: formData.courts,
    }));
  }, [formData.courts]);

  // Update courtsTouched when courts array changes (add/remove courts)
  useEffect(() => {
    setCourtsTouched((prev) => {
      // If courts length increased, add new touched object
      if (formData.courts.length > prev.length) {
        return [
          ...prev,
          Object.fromEntries(courtFields.map((field) => [field, false])),
        ];
      }
      // If courts length decreased, remove touched object
      if (formData.courts.length < prev.length) {
        return prev.slice(0, formData.courts.length);
      }
      return prev;
    });
  }, [formData.courts.length]);

  // For main fields
  const handleTouched = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  // For court fields
  const handleCourtTouched = (courtIdx: number, field: string) => {
    setCourtsTouched((prev) =>
      prev.map((obj, idx) =>
        idx === courtIdx ? { ...obj, [field]: true } : obj
      )
    );
  };

  const handleGoToHome = () => {
    // Redirect to home page
    window.location.href = "/";
  };
  const steps = [
    {
      title: "Basic Details",
      icon: Building,
      color: "from-[#ffe100] to-[#ffed4e]",
    },
    {
      title: "Address & Contact",
      icon: MapPin,
      color: "from-[#ffe100] to-[#ffed4e]",
    },
    { title: "Amenities", icon: Plus, color: "from-[#ffe100] to-[#ffed4e]" },
    {
      title: "Court Details",
      icon: Building,
      color: "from-[#ffe100] to-[#ffed4e]",
    },
    { title: "Declaration", icon: Check, color: "from-[#ffe100] to-[#ffed4e]" },
  ];

  const venueTypes = ["Turf", "Stadium", "Court", "Ground", "Complex"];
  const sportsOptions = [
    "Football",
    "Cricket",
    "Basketball",
    "Tennis",
    "Badminton",
    "Volleyball",
    "Swimming",
    "Hockey",
  ];
  const amenitiesOptions = [
    "WiFi",
    "Flood lights",
    "Washroom / Restroom",
    "Changing Room",
    "Drinking Water",
    "Artificial Grass",
    "Natural Grass",
    "Bike/Car Parking",
    "Mobile Charging",
    "Showers/Steam",
    "Match.refree",
    "Warm-up track",
    "Rental Equipment",
    "First Aid",
    "Locker Room",
    "Seating Area",
    "Cafeteria",
    "Coaching",
  ];

  const surfaceTypes = [
    "Natural Grass",
    "Artificial Turf",
    "Concrete",
    "Wooden",
    "Synthetic",
    "Clay",
  ];
  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const handleMultiSelect = <T extends keyof typeof formData>(
    field: T,
    value: string
  ) => {
    setFormData((prev) => {
      // Only allow multi-select on fields that are string arrays
      if (
        field === "sportsOffered" ||
        field === "amenities" ||
        field === "availableDays"
      ) {
        const arr = prev[field] as string[];
        return {
          ...prev,
          [field]: arr.includes(value)
            ? arr.filter((item) => item !== value)
            : [...arr, value],
        };
      }
      return prev;
    });
  };

  const nextStep = () => {
    // Try to scroll the main container to top (for both mobile and desktop)
    if ("scrollBehavior" in document.documentElement.style) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      window.scrollTo(0, 0);
    }
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

  const uploadImageAndGetUrl = async (file: File): Promise<string | null> => {
    const fileName = `${Date.now()}-${file.name}`;

    try {
      const res = await fetch(
        `/api/upload?fileName=${encodeURIComponent(fileName)}&fileType=${
          file.type
        }`
      );
      const { url, success } = await res.json();

      if (!success || !url) throw new Error("Failed to get signed URL");

      const uploadRes = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": file.type,
        },
        body: file,
      });

      if (!uploadRes.ok) throw new Error("Upload failed");

      // Use hardcoded or public ENV var (not process.env in browser)
      const publicUrl = `https://ofside-venue-images.s3.ap-south-1.amazonaws.com/${fileName}`;
      return publicUrl;
    } catch (err) {
      console.error("Image upload failed:", err);
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Step 1: Prepare all image upload jobs for each court
    type ImageJob = {
      file: File;
      courtIndex: number;
      imageType: "cover" | "logo" | "others";
      otherIndex?: number;
    };

    const allImageJobs: ImageJob[] = [];

    formData.courts.forEach((court, i) => {
      if (court.courtImages.cover) {
        allImageJobs.push({
          file: court.courtImages.cover,
          courtIndex: i,
          imageType: "cover",
        });
      }
      if (court.courtImages.logo) {
        allImageJobs.push({
          file: court.courtImages.logo,
          courtIndex: i,
          imageType: "logo",
        });
      }
      if (Array.isArray(court.courtImages.others)) {
        court.courtImages.others.forEach((file, idx) => {
          allImageJobs.push({
            file,
            courtIndex: i,
            imageType: "others",
            otherIndex: idx,
          });
        });
      }
    });

    // Step 2: Compress and upload all images in parallel
    const uploadResults = await Promise.allSettled(
      allImageJobs.map(async (job) => {
        const compressed = await compressImage(job.file);
        const url = await uploadImageAndGetUrl(compressed);
        return { ...job, url };
      })
    );

    // Step 3: Map uploaded URLs back to courtImages structure
    const updatedCourts = formData.courts.map((court, i) => {
      // Find uploaded cover
      const coverResult = uploadResults.find(
        (r) =>
          r.status === "fulfilled" &&
          r.value.courtIndex === i &&
          r.value.imageType === "cover" &&
          r.value.url
      ) as PromiseFulfilledResult<any> | undefined;

      // Find uploaded logo
      const logoResult = uploadResults.find(
        (r) =>
          r.status === "fulfilled" &&
          r.value.courtIndex === i &&
          r.value.imageType === "logo" &&
          r.value.url
      ) as PromiseFulfilledResult<any> | undefined;

      // Find uploaded others (array)
      const othersResults = uploadResults
        .filter(
          (r) =>
            r.status === "fulfilled" &&
            r.value.courtIndex === i &&
            r.value.imageType === "others" &&
            r.value.url
        )
        .sort(
          (a, b) =>
            (a.status === "fulfilled" && b.status === "fulfilled"
              ? (a.value.otherIndex ?? 0) - (b.value.otherIndex ?? 0)
              : 0)
        ) as PromiseFulfilledResult<any>[];

      return {
        ...court,
        courtImages: {
          cover: coverResult?.value.url ?? null,
          logo: logoResult?.value.url ?? null,
          others: othersResults.map((r) => r.value.url) as string[],
        },
      };
    });

    // Step 4: Prepare final payload (replace courtImages with URLs)
    const payload = {
      ...formData,
      courts: updatedCourts,
    };

    // Step 5: Submit the form data (replace with your API endpoint)
    try {
      const res = await fetch("/api/venue", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Submission failed");

      setShowSuccessPopup(true);
    } catch (err) {
      alert("Submission failed. Please try again.");
      setLoading(false);
    }
    setLoading(false);
  };

  const isStepValid = (stepIndex: number) => {
    switch (stepIndex) {
      case 0: // Basic Details
        return formData.venueName && formData.description;
      case 1: // Address & Contact
        return (
          formData.city &&
          formData.pincode &&
          formData.contactPersonName &&
          formData.contactPhone &&
          formData.contactEmail &&
          formData.ownerName &&
          formData.ownerPhone &&
          formData.ownerEmail
        );
      case 2: // Amenities
        return true; // Optional step

      case 3: // Court Details
        return formData.courts.every(
          (court) =>
            court.courtName &&
            court.courtSportType &&
            court.courtSlotDuration &&
            court.courtMaxPeople &&
            court.courtPricePerSlot &&
            court.courtImages &&
            court.courtImages.cover &&
            court.courtImages.logo &&
            (!court.courtPeakEnabled ||
              (court.courtPeakDays &&
                court.courtPeakDays.length > 0 &&
                court.courtPeakStart &&
                court.courtPeakEnd &&
                court.courtPeakPricePerSlot))
        );
      case 4: // Pricing & Availability
        return (
          formData.declarationAgreed &&
          formData.startTime &&
          formData.endTime &&
          formData.availableDays.length > 0
        );
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
          <h2 className="text-3xl font-extrabold mb-3 mt-8 text-gray-900 drop-shadow-lg">
            Venue application submitted!
          </h2>
          <p className="text-lg text-gray-700 mb-8 font-medium">
            Your venue details have been submitted for review.
            <br />
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

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-80">
        <div className="flex flex-col items-center">
          <svg
            className="animate-spin h-16 w-16 text-yellow-400 mb-6"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            />
          </svg>
          <span className="text-lg font-semibold text-yellow-700">
            Submitting your venue...
          </span>
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
        if (!formData.venueName.trim())
          errors.venueName = "Venue name is required.";
        if (!formData.description.trim())
          errors.description = "Description is required.";
        if (formData.availableDays.length === 0)
          errors.availableDays = "Select at least one operational day.";
        // Track if user has interacted with fields

        if (!formData.is24HoursOpen) {
          if (!formData.startTime?.trim())
            errors.startTime = "Start time is required.";
          if (!formData.endTime?.trim())
            errors.endTime = "End time is required.";
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
                    handleTouched("venueName");
                  }}
                  onBlur={() => handleTouched("venueName")}
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ffe100] focus:border-transparent transition-all text-gray-900 text-gray-700 ${
                    errors.venueName &&
                    touched.venueName &&
                    !formData.venueName.trim()
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  placeholder="Enter your venue name"
                  required
                />
                {errors.venueName &&
                  touched.venueName &&
                  !formData.venueName.trim() && (
                    <span className="text-xs text-red-600 mt-1 block">
                      {errors.venueName}
                    </span>
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
                    handleTouched("description");
                  }}
                  onBlur={() => handleTouched("description")}
                  rows={4}
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ffe100] focus:border-transparent transition-all resize-none text-gray-700 ${
                    errors.description &&
                    touched.description &&
                    !formData.description.trim()
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  placeholder="Describe your venue, facilities, and what makes it special..."
                  required
                />
                {errors.description &&
                  touched.description &&
                  !formData.description.trim() && (
                    <span className="text-xs text-red-600 mt-1 block">
                      {errors.description}
                    </span>
                  )}
              </div>
              <div className="lg:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Select the operational days *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-7 gap-3">
                  {daysOfWeek.map((day) => (
                    <label
                      key={day}
                      className="flex items-center space-x-2 p-3 border border-gray-200 rounded-xl hover:bg-red-50 hover:border-red-300 cursor-pointer transition-all"
                    >
                      <input
                        type="checkbox"
                        checked={formData.availableDays.includes(day)}
                        onChange={() => {
                          handleMultiSelect("availableDays", day);
                          handleTouched("availableDays");
                        }}
                        onBlur={() => handleTouched("availableDays")}
                        className="w-4 h-4 text-red-500 border-gray-300 rounded focus:ring-red-500 text-gray-700"
                      />
                      <span className="text-sm font-medium text-gray-700">
                        {day.slice(0, 3)}
                      </span>
                    </label>
                  ))}
                </div>
                {errors.availableDays &&
                  touched.availableDays &&
                  formData.availableDays.length === 0 && (
                    <span className="text-xs text-red-600 mt-1 block">
                      {errors.availableDays}
                    </span>
                  )}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-4">
                  <span className="text-sm font-semibold text-gray-700">
                    Venue is open 24 hours?
                  </span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={!!formData.is24HoursOpen}
                      onChange={(e) => {
                        setFormData((prev) => ({
                          ...prev,
                          is24HoursOpen: e.target.checked,
                          startTime: e.target.checked
                            ? "00:00"
                            : prev.startTime,
                          endTime: e.target.checked ? "23:59" : prev.endTime,
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
                        value={formData.startTime || "06:00"}
                        onChange={(e) => {
                          setFormData({
                            ...formData,
                            startTime: e.target.value,
                          });
                          handleTouched("startTime");
                        }}
                        onBlur={() => handleTouched("startTime")}
                        className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all text-gray-700 ${
                          errors.startTime &&
                          touched.startTime &&
                          !formData.is24HoursOpen &&
                          !formData.startTime?.trim()
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                        required
                        disabled={formData.is24HoursOpen}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Venue opening time (e.g., 06:00)
                    </p>
                    {errors.startTime &&
                      touched.startTime &&
                      !formData.is24HoursOpen &&
                      !formData.startTime?.trim() && (
                        <span className="text-xs text-red-600 mt-1 block">
                          {errors.startTime}
                        </span>
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
                        value={formData.endTime || "22:00"}
                        onChange={(e) => {
                          setFormData({ ...formData, endTime: e.target.value });
                          handleTouched("endTime");
                        }}
                        onBlur={() => handleTouched("endTime")}
                        className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all text-gray-700 ${
                          errors.endTime &&
                          touched.endTime &&
                          !formData.is24HoursOpen &&
                          !formData.endTime?.trim()
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                        required
                        disabled={formData.is24HoursOpen}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Venue closing time (e.g., 22:00)
                    </p>
                    {errors.endTime &&
                      touched.endTime &&
                      !formData.is24HoursOpen &&
                      !formData.endTime?.trim() && (
                        <span className="text-xs text-red-600 mt-1 block">
                          {errors.endTime}
                        </span>
                      )}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-700 mb-6">
                    <span className="font-bold">Note:</span> Your Venue profile
                    details will help attract users to your Venue. Please fill
                    correct details of your venue/turf/ground.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case 1: // Address & Contact
        // Validation logic
        const addressErrors: Record<string, string> = {};
        if (!formData.shopNo.trim())
          addressErrors.shopNo = "Shop/Building no. is required.";
        if (!formData.areaSectorLocality.trim())
          addressErrors.areaSectorLocality =
            "Area/Sector/Locality is required.";
        if (!formData.city.trim()) addressErrors.city = "City is required.";
        if (!formData.pincode.trim())
          addressErrors.pincode = "Pincode is required.";
        if (!formData.contactPersonName.trim())
          addressErrors.contactPersonName = "Contact person name is required.";
        if (!formData.contactPhone.trim())
          addressErrors.contactPhone = "Contact phone is required.";
        if (!formData.contactEmail.trim())
          addressErrors.contactEmail = "Contact email is required.";
        if (!formData.ownerName.trim())
          addressErrors.ownerName = "Owner name is required.";
        if (!formData.ownerPhone.trim())
          addressErrors.ownerPhone = "Owner phone is required.";
        if (!formData.ownerEmail.trim())
          addressErrors.ownerEmail = "Owner email is required.";

        // Simple email and phone validation (can be improved)
        if (
          formData.contactEmail &&
          !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactEmail)
        ) {
          addressErrors.contactEmail = "Enter a valid email address.";
        }
        if (
          formData.ownerEmail &&
          !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.ownerEmail)
        ) {
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
{isLoaded ? (
  <div className="col-span-1 sm:col-span-2 mb-2">
    <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
      Search &amp; Autofill Business Address <span className="text-yellow-500">*</span>
    </label>
    <div className="relative">
      <input
        type="text"
        placeholder="Search for your venue (e.g., Smash2Play, Play Arena)"
        className="w-full px-4 py-3 border-2 border-yellow-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 bg-yellow-50 text-gray-900 placeholder-gray-400 shadow-sm transition-all"
        onChange={(e) => fetchBusinessPredictions(e.target.value)}
        style={{ fontWeight: 500, fontSize: "1rem" }}
      />
      {businessResults.length > 0 && (
        <div className="absolute z-20 mt-1 w-full bg-white shadow-xl rounded-xl border border-yellow-200 max-h-64 overflow-auto animate__animated animate__fadeIn">
          {businessResults.map((prediction) => (
            <div
              key={prediction.place_id}
              className="p-3 hover:bg-yellow-50 hover:text-yellow-900 cursor-pointer transition-all border-b last:border-b-0 flex flex-col"
              onClick={() => handlePlaceSelect(prediction.place_id)}
            >
              <div className="font-semibold text-gray-900 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-yellow-500" />
                {prediction.structured_formatting.main_text}
                {prediction.types?.includes('establishment') && (
                  <span className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded font-semibold">
                    Verified Business
                  </span>
                )}
              </div>
              <div className="text-xs text-gray-500 pl-6">
                {prediction.structured_formatting.secondary_text}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
    <p className="text-xs text-yellow-700 mt-2">
      Start typing your venue name to quickly autofill address details from Google Maps.
    </p>
  </div>
) : (
  <div className="col-span-1 sm:col-span-2 flex items-center text-yellow-700 text-sm">
    <svg className="animate-spin h-5 w-5 mr-2 text-yellow-400" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
    </svg>
    Loading Google Maps...
  </div>
)}

        {/* Shop/Building no. */}
        <div className="w-full">
          <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
            Shop no./ Building no. *
          </label>
          <input
            type="text"
            value={formData.shopNo}
            onChange={(e) => {
              setFormData({ ...formData, shopNo: e.target.value });
              handleTouched("shopNo");
            }}
            onBlur={() => handleTouched("shopNo")}
            className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-700 ${
              addressErrors.shopNo && touched.shopNo
                ? "border-red-500"
                : "border-gray-300"
            } ${formData.fullAddress ? 'bg-gray-50' : ''}`}
            placeholder="Enter shop no./ building no."
            required
          />
          {addressErrors.shopNo && touched.shopNo && (
            <span className="text-xs text-red-600 mt-1 block">
              {addressErrors.shopNo}
            </span>
          )}
        </div>

        {/* Floor/Tower */}
        <div className="w-full">
          <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
            Floor/Tower (Optional)
          </label>
          <input
            type="text"
            value={formData.floorTower}
            onChange={(e) =>
              setFormData({ ...formData, floorTower: e.target.value })
            }
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-700"
            placeholder="Enter floor/tower"
          />
        </div>

        {/* Area/Sector/Locality */}
        <div className="w-full">
          <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
            Area / Sector / Locality *
          </label>
          <input
            type="text"
            value={formData.areaSectorLocality}
            onChange={(e) => {
              setFormData({
                ...formData,
                areaSectorLocality: e.target.value,
              });
              handleTouched("areaSectorLocality");
            }}
            onBlur={() => handleTouched("areaSectorLocality")}
            className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-700 ${
              addressErrors.areaSectorLocality && touched.areaSectorLocality
                ? "border-red-500"
                : "border-gray-300"
            } ${formData.fullAddress ? 'bg-gray-50' : ''}`}
            placeholder="Enter area/sector/locality"
            required
          />
          {addressErrors.areaSectorLocality && touched.areaSectorLocality && (
            <span className="text-xs text-red-600 mt-1 block">
              {addressErrors.areaSectorLocality}
            </span>
          )}
        </div>

        {/* City */}
        <div className="w-full">
          <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
            City *
          </label>
          <input
            type="text"
            value={formData.city}
            onChange={(e) => {
              setFormData({ ...formData, city: e.target.value });
              handleTouched("city");
            }}
            onBlur={() => handleTouched("city")}
            className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-700 ${
              addressErrors.city && touched.city
                ? "border-red-500"
                : "border-gray-300"
            } ${formData.fullAddress ? 'bg-gray-50' : ''}`}
            placeholder="Enter city"
            required
          />
          {addressErrors.city && touched.city && (
            <span className="text-xs text-red-600 mt-1 block">
              {addressErrors.city}
            </span>
          )}
        </div>

        {/* Landmark */}
        <div className="w-full">
          <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
            Any landmark area (Optional)
          </label>
          <input
            type="text"
            value={formData.landmark}
            onChange={(e) =>
              setFormData({ ...formData, landmark: e.target.value })
            }
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-700"
            placeholder="Add landmark area"
          />
        </div>

        {/* Pincode */}
        <div className="w-full">
          <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
            Area pincode *
          </label>
          <input
            type="text"
            value={formData.pincode}
            onChange={(e) => {
              setFormData({ ...formData, pincode: e.target.value });
              handleTouched("pincode");
            }}
            onBlur={() => handleTouched("pincode")}
            className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-700 ${
              addressErrors.pincode && touched.pincode
                ? "border-red-500"
                : "border-gray-300"
            } ${formData.fullAddress ? 'bg-gray-50' : ''}`}
            placeholder="Enter pincode"
            required
          />
          {addressErrors.pincode && touched.pincode && (
            <span className="text-xs text-red-600 mt-1 block">
              {addressErrors.pincode}
            </span>
          )}
        </div>

        {/* Address Note */}
        <div className="col-span-1 sm:col-span-2">
          <p className="text-sm text-gray-700 mb-4 sm:mb-6">
            <span className="font-bold">
              Please note Users will see this address on Ofside
            </span>
          </p>
        </div>

        {/* Contact Person Name */}
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
                setFormData({
                  ...formData,
                  contactPersonName: e.target.value,
                });
                handleTouched("contactPersonName");
              }}
              onBlur={() => handleTouched("contactPersonName")}
              className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-700 ${
                addressErrors.contactPersonName && touched.contactPersonName
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
              placeholder="Enter contact person name"
              required
            />
          </div>
          {addressErrors.contactPersonName && touched.contactPersonName && (
            <span className="text-xs text-red-600 mt-1 block">
              {addressErrors.contactPersonName}
            </span>
          )}
        </div>

        {/* Contact Person Phone */}
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
                setFormData({
                  ...formData,
                  contactPhone: e.target.value,
                });
                handleTouched("contactPhone");
              }}
              onBlur={() => handleTouched("contactPhone")}
              className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-700 ${
                addressErrors.contactPhone && touched.contactPhone
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
              placeholder="Enter phone number"
              required
            />
          </div>
          {addressErrors.contactPhone && touched.contactPhone && (
            <span className="text-xs text-red-600 mt-1 block">
              {addressErrors.contactPhone}
            </span>
          )}
        </div>

        {/* Contact Person Email */}
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
                setFormData({
                  ...formData,
                  contactEmail: e.target.value,
                });
                handleTouched("contactEmail");
              }}
              onBlur={() => handleTouched("contactEmail")}
              className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-700 ${
                addressErrors.contactEmail && touched.contactEmail
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
              placeholder="Enter email address"
              required
            />
          </div>
          {addressErrors.contactEmail && touched.contactEmail && (
            <span className="text-xs text-red-600 mt-1 block">
              {addressErrors.contactEmail}
            </span>
          )}
          <div className="mt-2">
            <span className="inline-block bg-yellow-100 text-gray-800 font-medium px-3 py-1 rounded">
              Booking confirmation emails will be sent to this address
            </span>
          </div>
        </div>

        {/* Same as Contact Checkbox */}
        <div className="flex items-center mt-6 mb-4 col-span-1 sm:col-span-2">
          <input
            type="checkbox"
            id="sameAsContact"
            className="w-5 h-5 accent-black mr-2"
            checked={sameAsContact}
            onChange={(e) => {
              const checked = e.target.checked;
              setSameAsContact(checked);

              if (checked) {
                setFormData({
                  ...formData,
                  ownerName: formData.contactPersonName,
                  ownerPhone: formData.contactPhone,
                  ownerEmail: formData.contactEmail,
                });
              } else {
                setFormData({
                  ...formData,
                  ownerName: "",
                  ownerPhone: "",
                  ownerEmail: "",
                });
              }
            }}
          />
          <label
            htmlFor="sameAsContact"
            className="text-sm text-gray-700 font-medium"
          >
            Owner details are same as contact person
          </label>
        </div>

        {/* Owner Details (conditionally shown) */}
        <div
          className={`col-span-2 gap-6 transition-all duration-300 grid grid-cols-1 sm:grid-cols-2 ${
            sameAsContact
              ? "max-h-0 opacity-0 overflow-hidden"
              : "max-h-[2000px] opacity-100"
          }`}
        >
          {/* Owner Name */}
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
                  handleTouched("ownerName");
                }}
                onBlur={() => handleTouched("ownerName")}
                className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-700 ${
                  addressErrors.ownerName && touched.ownerName
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                placeholder="Enter owner name"
                required
              />
            </div>
            {addressErrors.ownerName && touched.ownerName && (
              <span className="text-xs text-red-600 mt-1 block">
                {addressErrors.ownerName}
              </span>
            )}
          </div>

          {/* Owner Phone */}
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
                  setFormData({
                    ...formData,
                    ownerPhone: e.target.value,
                  });
                  handleTouched("ownerPhone");
                }}
                onBlur={() => handleTouched("ownerPhone")}
                className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-700 ${
                  addressErrors.ownerPhone && touched.ownerPhone
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                placeholder="Enter phone number"
                required
              />
            </div>
            {addressErrors.ownerPhone && touched.ownerPhone && (
              <span className="text-xs text-red-600 mt-1 block">
                {addressErrors.ownerPhone}
              </span>
            )}
          </div>

          {/* Owner Email */}
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
                  setFormData({
                    ...formData,
                    ownerEmail: e.target.value,
                  });
                  handleTouched("ownerEmail");
                }}
                onBlur={() => handleTouched("ownerEmail")}
                className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-700 ${
                  addressErrors.ownerEmail && touched.ownerEmail
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                placeholder="Enter email address"
                required
              />
            </div>
            {addressErrors.ownerEmail && touched.ownerEmail && (
              <span className="text-xs text-red-600 mt-1 block">
                {addressErrors.ownerEmail}
              </span>
            )}
          </div>
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
              {amenitiesOptions.map((amenity) => {
                const amenityIcons: Record<string, React.ElementType> = {
                  WiFi: Wifi || Upload, // fallback if Wifi not available
                  "Flood lights": Lightbulb,
                  "Washroom / Restroom": Droplets,
                  "Changing Room": User,
                  "Drinking Water": Droplets,
                  "Artificial Grass": Building,
                  "Natural Grass": Building,
                  "Bike/Car Parking": Car || MapPin,
                  "Mobile Charging": Phone,
                  "Showers/Steam": Droplets,
                  "Match.refree": Check,
                  "Warm-up track": Clock,
                  "Rental Equipment": Plus,
                  "First Aid": Shield || X,
                  "Locker Room": User,
                  "Seating Area": ChevronRight,
                  Cafeteria: Utensils || DollarSign,
                  Coaching: Dumbbell || ChevronLeft,
                };
                const Icon = amenityIcons[amenity] || Plus;
                const checked = formData.amenities.includes(amenity);

                return (
                  <label
                    key={amenity}
                    className={`flex flex-col items-center justify-center gap-2 p-4 border rounded-xl cursor-pointer transition-all
          ${
            checked
              ? "bg-green-50 border-green-400 shadow"
              : "bg-white border-gray-200 hover:bg-green-50 hover:border-green-300"
          }
        `}
                    style={{ minHeight: 110 }}
                  >
                    <Icon
                      className={`w-7 h-7 ${
                        checked ? "text-green-600" : "text-gray-400"
                      }`}
                    />
                    <span className="text-xs font-medium text-center text-gray-700">
                      {amenity}
                    </span>
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => {
                        handleMultiSelect("amenities", amenity);
                        handleTouched("amenities");
                      }}
                      className="mt-1 accent-green-500"
                      style={{ width: 18, height: 18 }}
                    />
                  </label>
                );
              })}
            </div>
            {amenitiesErrors.amenities && (
              <span className="text-xs text-red-600 mt-2 block text-center">
                {amenitiesErrors.amenities}
              </span>
            )}
          </div>
        );

      case 3: // Court Details
        // Multiple courts support

        return (
          <div className="space-y-8">
            {formData.courts.map((court, idx) => (
              <div
                key={idx}
                className="border rounded-2xl p-6 mb-8 bg-white shadow relative"
              >
                {formData.courts.length > 1 && (
                  <button
                    type="button"
                    className="absolute top-4 right-4 bg-red-100 text-red-600 rounded-full p-2 hover:bg-red-200 transition"
                    onClick={() => removeCourt(idx)}
                    title="Remove this court"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
                <div className="mb-4">
                  <span className="inline-block bg-orange-100 text-orange-700 font-semibold px-4 py-1 rounded-xl">
                    Court {idx + 1}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  {/* Court Name */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Court Name *
                    </label>
                    <input
                      type="text"
                      value={court.courtName}
                      onChange={(e) => {
                        handleCourtChange(idx, "courtName", e.target.value);
                      }}
                      onBlur={() => handleCourtTouched(idx, "courtName")}
                      className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-gray-700 ${
                        courtsErrors[idx]?.courtName
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      placeholder="e.g., Court A, Main Ground"
                      required
                    />
                    {courtsErrors[idx]?.courtName && (
                      <span className="text-xs text-red-600 mt-1 block">
                        {courtsErrors[idx].courtName}
                      </span>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Surface Type
                    </label>
                    <select
                      value={court.surfaceType}
                      onChange={(e) => {
                        handleCourtChange(idx, "surfaceType", e.target.value);
                      }}
                      onBlur={() => handleCourtTouched(idx, "surfaceType")}
                      className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-gray-700 ${
                        courtsErrors[idx]?.surfaceType
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    >
                      <option value="">Select surface type</option>
                      {surfaceTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                    {courtsErrors[idx]?.surfaceType && (
                      <span className="text-xs text-red-600 mt-1 block">
                        {courtsErrors[idx].surfaceType}
                      </span>
                    )}
                  </div>

                    {/* Court Images Upload Section */}
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Court Images (Cover, Logo, and Others) <span className="text-red-500">*</span>
                      </label>
                        {/* Cover Image */}
                        <div className="flex flex-col items-center w-32">
                          <span className="text-xs font-semibold mb-2">Cover Image</span>
                          <div
                            className={`relative border-2 border-dashed rounded-xl w-28 h-28 flex items-center justify-center transition-all duration-200 bg-gray-50 hover:bg-orange-50 ${
                              courtsErrors[idx]?.courtImages && !court.courtImages.cover
                                ? "border-red-500"
                                : "border-gray-300 hover:border-orange-400"
                            }`}
                          >
                            {court.courtImages.cover ? (
                              <>
                                <Image
                                  src={URL.createObjectURL(court.courtImages.cover)}
                                  alt="Cover"
                                  className="w-full h-full object-cover rounded-xl"
                                  width={112}
                                  height={112}
                                />
                                <button
                                  type="button"
                                  onClick={() => handleRemoveCourtImage(idx, 0)}
                                  onBlur={() => handleCourtTouched(idx, "courtImages")}
                                  className="absolute top-1 right-1 bg-white text-red-600 border border-red-200 rounded-full p-1 shadow hover:bg-red-500 hover:text-white transition"
                                  title="Remove"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </>
                            ) : (
                              <>
                                <Camera className="w-8 h-8 text-gray-300" />
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => {
                                    if (e.target.files && e.target.files[0]) {
                                      // Only update cover image
                                      setFormData((prev) => {
                                        const updatedCourts = prev.courts.map((courtItem, i) =>
                                          i === idx
                                            ? {
                                                ...courtItem,
                                                courtImages: {
                                                  ...courtItem.courtImages,
                                                  cover: e.target.files![0],
                                                },
                                              }
                                            : courtItem
                                        );
                                        return { ...prev, courts: updatedCourts };
                                      });
                                    }
                                  }}
                                  onBlur={() => handleCourtTouched(idx, "courtImages")}
                                  className="absolute inset-0 opacity-0 cursor-pointer"
                                  style={{ width: "100%", height: "100%" }}
                                />
                              </>
                            )}
                          </div>
                          <span className="text-xs text-gray-500 text-center mt-1">First impression</span>
                        </div>
                        {/* Logo/Profile Image */}
                        <div className="flex flex-col items-center w-32">
                          <span className="text-xs font-semibold mb-2">Logo / Profile</span>
                          <div
                            className={`relative border-2 border-dashed rounded-xl w-28 h-28 flex items-center justify-center transition-all duration-200 bg-gray-50 hover:bg-orange-50 ${
                              courtsErrors[idx]?.courtImages && !court.courtImages.logo
                                ? "border-red-500"
                                : "border-gray-300 hover:border-orange-400"
                            }`}
                          >
                            {court.courtImages.logo ? (
                              <>
                                <Image
                                  src={URL.createObjectURL(court.courtImages.logo)}
                                  alt="Logo"
                                  className="w-full h-full object-cover rounded-xl"
                                  width={112}
                                  height={112}
                                />
                                <button
                                  type="button"
                                  onClick={() => handleRemoveCourtImage(idx, 1)}
                                  onBlur={() => handleCourtTouched(idx, "courtImages")}
                                  className="absolute top-1 right-1 bg-white text-red-600 border border-red-200 rounded-full p-1 shadow hover:bg-red-500 hover:text-white transition"
                                  title="Remove"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </>
                            ) : (
                              <>
                                <Camera className="w-8 h-8 text-gray-300" />
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => {
                                    if (e.target.files && e.target.files[0]) {
                                      // Only update logo image
                                      setFormData((prev) => {
                                        const updatedCourts = prev.courts.map((courtItem, i) =>
                                          i === idx
                                            ? {
                                                ...courtItem,
                                                courtImages: {
                                                  ...courtItem.courtImages,
                                                  logo: e.target.files![0],
                                                },
                                              }
                                            : courtItem
                                        );
                                        return { ...prev, courts: updatedCourts };
                                      });
                                    }
                                  }}
                                  onBlur={() => handleCourtTouched(idx, "courtImages")}
                                  className="absolute inset-0 opacity-0 cursor-pointer"
                                  style={{ width: "100%", height: "100%" }}
                                />
                              </>
                            )}
                          </div>
                          <span className="text-xs text-gray-500 text-center mt-1">Logo or profile</span>
                        </div>
                        {/* Other Images (single box, multiple files) */}
                        <div className="flex flex-col items-center w-40 flex-1 min-w-[140px]">
                          <span className="text-xs font-semibold mb-2">Other Images</span>
                          <div
                            className={`relative border-2 border-dashed rounded-xl w-full min-h-[112px] flex items-center justify-center transition-all duration-200 bg-gray-50 hover:bg-orange-50 ${
                              courtsErrors[idx]?.courtImages && court.courtImages.others.length === 0
                                ? "border-red-500"
                                : "border-gray-300 hover:border-orange-400"
                            }`}
                            style={{ minHeight: 112, maxWidth: 180 }}
                          >
                            {court.courtImages.others && court.courtImages.others.length > 0 ? (
                              <div className="flex flex-wrap gap-2 justify-center items-center w-full h-full p-1">
                                {court.courtImages.others.map((file, oIdx) => (
                                  <div key={oIdx} className="relative w-12 h-12 rounded overflow-hidden shadow border border-gray-200 bg-white">
                                    <Image
                                      src={URL.createObjectURL(file)}
                                      alt={`Other ${oIdx + 1}`}
                                      className="w-full h-full object-cover"
                                      width={48}
                                      height={48}
                                    />
                                    <button
                                      type="button"
                                      onClick={() => handleRemoveCourtImage(idx, oIdx + 2)}
                                      onBlur={() => handleCourtTouched(idx, "courtImages")}
                                      className="absolute -top-1 -right-1 bg-white text-red-600 border border-red-200 rounded-full p-0.5 shadow hover:bg-red-500 hover:text-white transition"
                                      title="Remove"
                                      style={{ fontSize: 10 }}
                                    >
                                      <X className="w-3 h-3" />
                                    </button>
                                  </div>
                                ))}
                                {court.courtImages.others.length < 3 && (
                                  <label className="w-12 h-12 flex items-center justify-center cursor-pointer rounded border border-dashed border-gray-300 bg-white hover:bg-orange-50 transition">
                                    <Camera className="w-6 h-6 text-gray-300" />
                                    <input
                                      type="file"
                                      accept="image/*"
                                      multiple
                                      onChange={(e) => {
                                        if (e.target.files && e.target.files.length > 0) {
                                          // Only update others images
                                          const filesArr = Array.from(e.target.files).slice(0, 3 - court.courtImages.others.length);
                                          setFormData((prev) => {
                                            const updatedCourts = prev.courts.map((courtItem, i) =>
                                              i === idx
                                                ? {
                                                    ...courtItem,
                                                    courtImages: {
                                                      ...courtItem.courtImages,
                                                      others: [
                                                        ...courtItem.courtImages.others,
                                                        ...filesArr,
                                                      ].slice(0, 3),
                                                    },
                                                  }
                                                : courtItem
                                            );
                                            return { ...prev, courts: updatedCourts };
                                          });
                                        }
                                      }}
                                      onBlur={() => handleCourtTouched(idx, "courtImages")}
                                      className="absolute inset-0 opacity-0 cursor-pointer"
                                      style={{ width: "100%", height: "100%" }}
                                    />
                                  </label>
                                )}
                              </div>
                            ) : (
                              <>
                                <Camera className="w-8 h-8 text-gray-300" />
                                <input
                                  type="file"
                                  accept="image/*"
                                  multiple
                                  onChange={(e) => {
                                    if (e.target.files && e.target.files.length > 0) {
                                      const filesArr = Array.from(e.target.files).slice(0, 3);
                                      setFormData((prev) => {
                                        const updatedCourts = prev.courts.map((courtItem, i) =>
                                          i === idx
                                            ? {
                                                ...courtItem,
                                                courtImages: {
                                                  ...courtItem.courtImages,
                                                  others: filesArr,
                                                },
                                              }
                                            : courtItem
                                        );
                                        return { ...prev, courts: updatedCourts };
                                      });
                                    }
                                  }}
                                  onBlur={() => handleCourtTouched(idx, "courtImages")}
                                  className="absolute inset-0 opacity-0 cursor-pointer"
                                  style={{ width: "100%", height: "100%" }}
                                />
                              </>
                            )}
                          </div>
                          <span className="text-xs text-gray-500 text-center mt-1">Up to 3 images</span>
                        </div>
                    </div>
                      {courtsErrors[idx]?.courtImages && (
                        <span className="text-xs text-red-600 mt-1 block">
                          {courtsErrors[idx].courtImages}
                        </span>
                      )}
                      <p className="text-sm text-gray-600 mt-2">
                        <span className="font-bold">Note:</span> Upload clear, high-quality images. Cover and logo are required. Other images are optional but recommended.
                      </p>
                
                
               

                  {/* Sport Type */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Sport Type *
                    </label>
                    <select
                      value={court.courtSportType}
                      onChange={(e) => {
                        handleCourtChange(
                          idx,
                          "courtSportType",
                          e.target.value
                        );
                      }}
                      onBlur={() => handleCourtTouched(idx, "courtSportType")}
                      className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-gray-700 ${
                        courtsErrors[idx]?.courtSportType
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      required
                    >
                      <option value="">Select sport type</option>
                      {sportsOptions.map((sport) => (
                        <option key={sport} value={sport}>
                          {sport}
                        </option>
                      ))}
                    </select>
                    {courtsErrors[idx]?.courtSportType && (
                      <span className="text-xs text-red-600 mt-1 block">
                        {courtsErrors[idx].courtSportType}
                      </span>
                    )}
                  </div>

                  {/* Slot Duration (hours) */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Slot Duration (hours) *
                    </label>
                    <select
                      value={court.courtSlotDuration}
                      onChange={(e) => {
                        handleCourtChange(
                          idx,
                          "courtSlotDuration",
                          e.target.value
                        );
                      }}
                      onBlur={() =>
                        handleCourtTouched(idx, "courtSlotDuration")
                      }
                      className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-gray-700 ${
                        courtsErrors[idx]?.courtSlotDuration
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      required
                    >
                      <option value="">Select duration here</option>
                      {[1, 2, 3, 4, 5].map((hour) => (
                        <option key={hour} value={hour}>
                          {hour} hour{hour > 1 ? "s" : ""}
                        </option>
                      ))}
                    </select>
                    {courtsErrors[idx]?.courtSlotDuration && (
                      <span className="text-xs text-red-600 mt-1 block">
                        {courtsErrors[idx].courtSlotDuration}
                      </span>
                    )}
                  </div>

                  {/* How many in 1 slot */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Max Booking Per Slot *
                    </label>
                    <select
                      value={court.courtMaxPeople}
                      onChange={(e) => {
                        handleCourtChange(
                          idx,
                          "courtMaxPeople",
                          e.target.value
                        );
                      }}
                      onBlur={() => handleCourtTouched(idx, "courtMaxPeople")}
                      className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-gray-700 ${
                        courtsErrors[idx]?.courtMaxPeople
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      required
                    >
                      <option value="">Select max booking here</option>
                      {[...Array(20)].map((_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {i + 1}
                        </option>
                      ))}
                    </select>
                    {courtsErrors[idx]?.courtMaxPeople && (
                      <span className="text-xs text-red-600 mt-1 block">
                        {courtsErrors[idx].courtMaxPeople}
                      </span>
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
                      value={court.courtPricePerSlot}
                      onChange={(e) => {
                        handleCourtChange(
                          idx,
                          "courtPricePerSlot",
                          e.target.value
                        );
                      }}
                      onBlur={() =>
                        handleCourtTouched(idx, "courtPricePerSlot")
                      }
                      className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-gray-700 ${
                        courtsErrors[idx]?.courtPricePerSlot
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      placeholder="e.g., 500"
                      required
                    />
                    {courtsErrors[idx]?.courtPricePerSlot && (
                      <span className="text-xs text-red-600 mt-1 block">
                        {courtsErrors[idx].courtPricePerSlot}
                      </span>
                    )}
                  </div>

                  {/* Peak Hours Toggle */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <span className="text-sm font-semibold text-gray-700">
                      Set different price for peak hours?
                    </span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={court.courtPeakEnabled}
                        onChange={(e) =>
                          handleCourtChange(
                            idx,
                            "courtPeakEnabled",
                            e.target.checked
                          )
                        }
                        onBlur={() =>
                          handleCourtTouched(idx, "courtPeakEnabled")
                        }
                        className="sr-only peer"
                      />
                      <div
                        className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full 
      peer peer-checked:after:translate-x-full peer-checked:after:border-white 
      after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white 
      after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all 
      peer-checked:bg-orange-500"
                      ></div>
                    </label>
                  </div>
                </div>
                {/* Peak Hours Details */}
                {court.courtPeakEnabled && (
                  <div className="grid gap-6 sm:grid-cols-2 mt-3">
                    {/* Peak Days */}
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Peak Days
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
                        {daysOfWeek.map((day) => (
                          <label
                            key={day}
                            className="flex items-center space-x-2 p-3 border border-gray-200 rounded-xl 
              hover:bg-orange-50 hover:border-orange-300 cursor-pointer transition-all"
                          >
                            <input
                              type="checkbox"
                              checked={court.courtPeakDays.includes(day)}
                              onChange={() =>
                                handleCourtMultiSelect(
                                  idx,
                                  "courtPeakDays",
                                  day
                                )
                              }
                              onBlur={() =>
                                handleCourtTouched(idx, "courtPeakDays")
                              }
                              className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                            />
                            <span className="text-sm font-medium text-gray-700">
                              {day.slice(0, 3)}
                            </span>
                          </label>
                        ))}
                      </div>
                      {courtsErrors[idx]?.courtPeakDays && (
                        <span className="text-xs text-red-600 mt-1 block">
                          {courtsErrors[idx].courtPeakDays}
                        </span>
                      )}
                    </div>

                    {/* Peak Hours */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Peak Hours (Select Range)
                      </label>
                      <div className="flex flex-col sm:flex-row gap-4 items-center">
                        <input
                          type="time"
                          value={court.courtPeakStart}
                          onChange={(e) =>
                            handleCourtChange(
                              idx,
                              "courtPeakStart",
                              e.target.value
                            )
                          }
                          onBlur={() =>
                            handleCourtTouched(idx, "courtPeakStart")
                          }
                          className={`px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 
            ${
              courtsErrors[idx]?.courtPeakStart
                ? "border-red-500"
                : "border-gray-300"
            }`}
                        />
                        <span className="mx-2 text-gray-500">to</span>
                        <input
                          type="time"
                          value={court.courtPeakEnd}
                          onChange={(e) =>
                            handleCourtChange(
                              idx,
                              "courtPeakEnd",
                              e.target.value
                            )
                          }
                          onBlur={() => handleCourtTouched(idx, "courtPeakEnd")}
                          className={`px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 
            ${
              courtsErrors[idx]?.courtPeakEnd
                ? "border-red-500"
                : "border-gray-300"
            }`}
                        />
                      </div>
                      {courtsErrors[idx]?.courtPeakStart && (
                        <span className="text-xs text-red-600 mt-1 block">
                          {courtsErrors[idx].courtPeakStart}
                        </span>
                      )}
                      {courtsErrors[idx]?.courtPeakEnd && (
                        <span className="text-xs text-red-600 mt-1 block">
                          {courtsErrors[idx].courtPeakEnd}
                        </span>
                      )}
                    </div>

                    {/* Price per slot */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Peak Hours Price Per Slot (₹)
                      </label>
                      <input
                        type="number"
                        min={0}
                        value={court.courtPeakPricePerSlot}
                        onChange={(e) =>
                          handleCourtChange(
                            idx,
                            "courtPeakPricePerSlot",
                            e.target.value
                          )
                        }
                        onBlur={() =>
                          handleCourtTouched(idx, "courtPeakPricePerSlot")
                        }
                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 
          ${
            courtsErrors[idx]?.courtPeakPricePerSlot
              ? "border-red-500"
              : "border-gray-300"
          }`}
                        placeholder="e.g., 700"
                      />
                      {courtsErrors[idx]?.courtPeakPricePerSlot && (
                        <span className="text-xs text-red-600 mt-1 block">
                          {courtsErrors[idx].courtPeakPricePerSlot}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
            <div className="flex justify-center">
              <button
                type="button"
                className="bg-gradient-to-r from-orange-400 to-orange-500 text-white font-bold py-2 px-6 rounded-xl shadow hover:scale-105 hover:shadow-lg transition-all"
                onClick={addCourt}
              >
                <Plus className="inline-block w-5 h-5 mr-2" />
                Add More Courts
              </button>
            </div>
          </div>
        );

      case 4: // Declaration
        // Validation logic
        const declarationErrors: Record<string, string> = {};
        return (
          <div className="space-y-8">
            <div className="col-span-2">
              <h3 className="text-xl font-bold text-gray-700 text-center mb-4">
                Declaration & Consent
              </h3>
              <div className="mb-4">
                <span className="text-gray-800">
                  I hereby certify that I am an authorized representative of{" "}
                  <span className="font-semibold">
                    {formData.venueName || "[Venue Name]"}
                  </span>
                  , and that all information provided in the Ofside onboarding
                  form is true, complete, and accurate to the best of my
                  knowledge. I understand that Ofside (powered by Rankshell –
                  India’s ultimate sports ecosystem) will rely on these details
                  to list and promote my venue.
                </span>
              </div>
              <div className="mb-4">
                <strong className="font-semibold text-gray-700">
                  Details Provided:
                </strong>
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
                  I understand that this declaration constitutes my formal
                  consent and will be used to activate and manage my venue
                  listing on the Ofside platform. I acknowledge that any false
                  or misleading information may result in removal from the
                  platform or other remedial action by Ofside.
                </span>
              </div>
              <div className="flex items-center mt-6">
                <input
                  type="checkbox"
                  id="declaration"
                  className={`w-5 h-5 accent-black mr-2 ${
                    declarationErrors.declarationAgreed ? "border-red-500" : ""
                  }`}
                  checked={formData.declarationAgreed}
                  onChange={(e) => {
                    setFormData((prev) => ({
                      ...prev,
                      declarationAgreed: e.target.checked,
                    }));
                    handleTouched("declarationAgreed");
                  }}
                  onBlur={() => handleTouched("declarationAgreed")}
                />
                <label
                  htmlFor="declaration"
                  className="font-semibold text-gray-900"
                >
                  I agree and confirm the accuracy of the above information.
                </label>
              </div>
              {declarationErrors.declarationAgreed && (
                <span className="text-xs text-red-600 mt-2 block">
                  {declarationErrors.declarationAgreed}
                </span>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="h-auto sm:h-screen sm:overflow-hidden flex flex-col  flex-1">
      <div className="min-h-screen ">
        <div className="flex sm:h-screen p-2 bg-white  flex-col lg:flex-row">
          <div className="w-full lg:w-1/3 p-0 bg-theme-primary-light relative  flex flex-col h-auto md:min-h-[350px] sm:h-[350px] sm:h-[400px] md:h-[500px] lg:h-auto">
            {/* Background Video */}
            <video
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover z-2"
              style={{ filter: "brightness(0.9)" }}
            >
              <source src={footballVideo} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            {/* Overlay for content */}
            <div
              className="
                relative  z-4 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-12 h-full
                flex flex-col justify-center
                md:flex-col
              "
            >
              {/* Header and Info */}
              <div className="flex flex-col items-center  sm:mb-6 md:mb-0">
                <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-3 sm:mb-6 drop-shadow-lg tracking-tight">
                  List Your Sports Venue
                </h1>
                <p className="text-base text-center w-80 sm:w-100 sm:text-lg text-white max-w-2xl mx-auto md:mx-0 mb-2 sm:mb-6 font-medium">
                  Join thousands of venue owners and start earning by listing your sports facility on <span className="font-bold text-yellow-300">Ofside</span>
                </p>
                {/* Enhanced Info with circled checks */}
                <div className="hidden md:block mt-4 sm:mt-8 space-y-4 sm:space-y-6 text-white">
                  {[
                    "Get discovered by thousands of sports enthusiasts in your city.",
                    "Easy booking management and hassle-free payments.",
                    "Dedicated support team to help you grow your business.",
                  ].map((text, idx) => (
                    <div key={idx} className="flex justify-start items-center gap-3">
                      <span className="inline-flex items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-green-600 shadow-lg p-2 mr-2">
                        <Check className="w-6 h-6 text-white" />
                      </span>
                      <span className="text-sm sm:text-base md:text-lg font-semibold text-white drop-shadow">
                        {text}
                      </span>
                    </div>
                  ))}
                </div>
                {/* Decorative divider */}
                <div className="w-16 h-1 bg-gradient-to-r from-yellow-300 to-yellow-400 rounded-full hidden sm:block mt-6 mb-2 mx-auto" />
              </div>
              {/* Contact/Help */}
              <div className="mt-2 sm:mt-6 sm:mt-12 flex justify-center">
                <span className="inline-flex items-center bg-gradient-to-r from-[#ffe100] to-[#ffed4e] text-black font-semibold px-4 sm:px-6 py-1 sm:py-2 rounded-md shadow text-xs sm:text-base gap-2 border-2 border-yellow-300">
                  <span className="flex items-center gap-1">
                  
                    Need help?
                  </span>
                  <a
                    href="mailto:play@ofside.in"
                    className="underline text-black inline-flex items-center gap-1 font-medium"
                  >
                    <Mail className="inline-block w-4 h-4" /> Connect
                  </a>
                  <span>or</span>
                  <a
                    href="tel:+919811785330"
                    className="underline text-black inline-flex items-center gap-1 font-medium"
                  >
                    <Phone className="inline-block w-4 h-4" /> Call us
                  </a>
                </span>
              </div>
            </div>
            {/* Overlay for darkening video */}
            <div className="absolute inset-0 bg-black bg-opacity-40 pointer-events-none z-0" />
        
          </div>

          {/* Progress Indicator */}
          <div
            className="w-full lg:w-2/3 bg-gray-100 sm:overflow-y-auto p-2 sm:p-6"
            ref={rightRef}
          >
            <div className="mb-12">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-4 mt-2 sm:mt-0 sm:mb-8">
                {steps.map((step, index) => (
                  <React.Fragment key={index}>
                    <div className="flex flex-col items-center min-hitew-[40px] sm:min-w-[70px]">
                      <div
                        className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 shadow transition-all duration-300
            ${
              index < currentStep
                ? "bg-green-500 border-green-500 text-white"
                : index === currentStep
                ? `bg-gradient-to-r ${step.color} border-transparent text-black scale-110 ring-2 ring-yellow-200`
                : "bg-white border-gray-300 text-gray-400"
            }
          `}
                      >
                        {index < currentStep ? (
                          <Check className="w-4 h-4 sm:w-5 sm:h-5" />
                        ) : (
                          React.createElement(step.icon, {
                            className: "w-4 h-4 sm:w-5 sm:h-5",
                          })
                        )}
                      </div>

                      {/* Step name only visible on sm and above */}
                      <span
                        className={`hidden sm:block mt-2 text-xs font-medium text-center transition-all duration-200 ${
                          index === currentStep
                            ? "text-black"
                            : index < currentStep
                            ? "text-green-600"
                            : "text-gray-400"
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
                            ? "bg-green-500"
                            : index === currentStep
                            ? "bg-gradient-to-r from-yellow-300 to-yellow-400"
                            : "bg-gray-300"
                        }`}
                      />
                    )}
                  </React.Fragment>
                ))}
              </div>

              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                {/* Step Header */}
                <div
                  className={`bg-gradient-to-r ${steps[currentStep].color} p-4 sm:px-8 sm:py-6`}
                >
                  <h2 className="text-xl sm:text-2xl font-bold text-black flex items-center">
                    {React.createElement(steps[currentStep].icon, {
                      className: "w-6 h-6 mr-3",
                    })}
                    {steps[currentStep].title}
                  </h2>
                </div>

                {/* Step Content */}
                <div className="p-4 sm:p-8 min-h-[400px]">
                  {renderStepContent()}
                </div>

                {/* Navigation Buttons */}
                <div
                  className={`px-4 py-4 sm:px-6 sm:py-6 bg-gray-50 border-t border-gray-100 flex ${
                    currentStep === 4 ? "flex-col" : "flex-row"
                  } items-center justify-center gap-2`}
                >
                  <button
                    type="button"
                    onClick={prevStep}
                    disabled={currentStep === 0}
                    className={`flex items-center space-x-2 px-4 py-2 sm:px-6 sm:py-3 rounded-xl font-medium transition-all justify-center ${
                      currentStep === 0
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                        : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                    } ${currentStep === 4 ? "w-full" : "w-full sm:w-auto"}`}
                    style={
                      currentStep === 4 ? { width: "100%" } : { maxWidth: 160 }
                    }
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>

                  <div
                    className="text-sm text-gray-500 flex-shrink-0 text-center"
                    style={{ minWidth: 110 }}
                  >
                    Step {currentStep + 1} of {steps.length}
                  </div>

                  {currentStep === steps.length - 1 ? (
                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={!formData.declarationAgreed}
                      className={`bg-gradient-to-r from-[#ffe100] to-[#ffed4e] text-black font-bold py-3 px-8 rounded-xl shadow-lg flex items-center space-x-3 w-full justify-center transition-all duration-200
                        ${
                          formData.declarationAgreed
                            ? "hover:from-[#e6cb00] hover:to-[#e6d43f] hover:shadow-xl transform hover:scale-105"
                            : "opacity-60 cursor-not-allowed"
                        }
                      `}
                      style={{
                        fontSize: "1.15rem",
                        letterSpacing: "0.02em",
                        boxShadow: "0 4px 16px 0 rgba(255,225,0,0.10)",
                        border: "2px solid #ffe100",
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
                          ? `bg-gradient-to-r ${steps[currentStep].color} text-gray-900 hover:shadow-lg transform hover:scale-105`
                          : "bg-gray-200 text-gray-400 cursor-not-allowed"
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
                  Your venue will be reviewed within 24-48 hours and you will be
                  notified via email.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
