"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { PageTitle } from "@/components/ui/page-title";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Eye, CheckCircle, Users, Calendar, Clock, Filter, Crown, Info } from "lucide-react";

// Types
interface Candidate {
  id: string;
  name: string;
  avatarUrl?: string;
  role: string;
  pricePerMonth: number;
  currency: string;
  languages: string[];
  specializations: string[];
  skills: string[];
  about: string;
  experienceLevel: "Junior" | "Mid" | "Senior";
  email?: string;
  phone?: string;
  experience?: string;
  certifications?: string[];
  availability?: string;
  notes?: string;
}

interface InterviewPanel {
  id: string;
  hireRequestId: string;
  roleTitle: string;
  department: string;
  location: string;
  status: "Panel Ready" | "Awaiting Decision" | "Placement Complete";
  dateSubmitted: string;
  estimatedStartDate?: string;
  contractLength?: string;
  salaryRange?: { min: number; max: number; currency: string };
  candidates: Candidate[];
  timeLimit: number; // Time limit in milliseconds (24 hours)
  startTime: number; // Start time in milliseconds
  selectedWinner?: Candidate; // For completed panels
}

interface HireRequest {
  id: string;
  role: string;
  roleTitle: string;
  department: string;
  practiceArea: string;
  scheduleNeeds: string;
  location: string;
  requiredSkills: string[];
  keyResponsibilities: string;
  priority: string;
  estimatedStartDate: string;
  contractLength: string;
  remoteWork: string;
  travelRequired: string;
  certifications: string[];
  experienceLevel: string;
  salaryRange: { min: number; max: number; currency: string };
  benefits: string[];
  additionalNotes: string;
  status: string;
  dateSubmitted: string;
  description: string;
}

// Mock data for interview panels
const interviewPanels: InterviewPanel[] = [
  {
    id: "1",
    hireRequestId: "6",
    roleTitle: "Pharmacist",
    department: "Pharmacy",
    location: "Jacksonville, FL",
    status: "Panel Ready",
    dateSubmitted: "2024-05-27",
    estimatedStartDate: "2024-07-25",
    contractLength: "12 months",
    salaryRange: { min: 70000, max: 85000, currency: "USD" },
    timeLimit: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
    startTime: Date.now() - (12 * 60 * 60 * 1000), // Started 12 hours ago
    candidates: [
      {
        id: "1",
        name: "Lisa Thompson",
        avatarUrl: undefined,
        role: "Pharmacist",
        pricePerMonth: 2800,
        currency: "USD",
        languages: ["English"],
        specializations: ["Clinical Pharmacy"],
        skills: ["Medication Review", "Drug Interactions", "Patient Counseling"],
        about: "Clinical pharmacist with experience in medication management and patient education.",
        experienceLevel: "Senior",
        email: "lisa.thompson@email.com",
        phone: "+1 (904) 555-0101",
        experience: "8 years in clinical pharmacy",
        certifications: ["Pharmacist License", "BCPS"],
        availability: "Full-time, regular business hours",
        notes: "Expert in medication therapy management"
      },
      {
        id: "2",
        name: "Michael Chen",
        avatarUrl: undefined,
        role: "Pharmacist",
        pricePerMonth: 2600,
        currency: "USD",
        languages: ["English", "Mandarin"],
        specializations: ["Hospital Pharmacy"],
        skills: ["IV Compounding", "Anticoagulation", "Infectious Disease"],
        about: "Hospital pharmacist with expertise in IV compounding and infectious disease management.",
        experienceLevel: "Senior",
        email: "michael.chen@email.com",
        phone: "+1 (904) 555-0102",
        experience: "6 years in hospital pharmacy",
        certifications: ["Pharmacist License", "BCPS"],
        availability: "Full-time, rotating shifts",
        notes: "Specializes in critical care pharmacy"
      },
      {
        id: "3",
        name: "Sarah Johnson",
        avatarUrl: undefined,
        role: "Pharmacist",
        pricePerMonth: 2400,
        currency: "USD",
        languages: ["English"],
        specializations: ["Retail Pharmacy"],
        skills: ["Patient Counseling", "Immunizations", "Medication Therapy Management"],
        about: "Retail pharmacist with strong patient counseling and immunization skills.",
        experienceLevel: "Mid",
        email: "sarah.johnson@email.com",
        phone: "+1 (904) 555-0103",
        experience: "4 years in retail pharmacy",
        certifications: ["Pharmacist License", "Immunization Certified"],
        availability: "Full-time, flexible schedule",
        notes: "Excellent patient communication skills"
      },
      {
        id: "4",
        name: "David Wilson",
        avatarUrl: undefined,
        role: "Pharmacist",
        pricePerMonth: 2700,
        currency: "USD",
        languages: ["English"],
        specializations: ["Ambulatory Care"],
        skills: ["Medication Therapy Management", "Chronic Disease Management", "Patient Education"],
        about: "Ambulatory care pharmacist with focus on chronic disease management.",
        experienceLevel: "Senior",
        email: "david.wilson@email.com",
        phone: "+1 (904) 555-0104",
        experience: "7 years in ambulatory care",
        certifications: ["Pharmacist License", "BCACP"],
        availability: "Full-time, regular business hours",
        notes: "Specializes in chronic disease management"
      },
      {
        id: "5",
        name: "Jennifer Adams",
        avatarUrl: undefined,
        role: "Pharmacist",
        pricePerMonth: 2500,
        currency: "USD",
        languages: ["English", "Spanish"],
        specializations: ["Community Pharmacy"],
        skills: ["Immunizations", "Patient Counseling", "Medication Reviews"],
        about: "Community pharmacist with strong patient interaction skills.",
        experienceLevel: "Mid",
        email: "jennifer.adams@email.com",
        phone: "+1 (904) 555-0105",
        experience: "5 years in community pharmacy",
        certifications: ["Pharmacist License", "Immunization Certified"],
        availability: "Full-time, flexible schedule",
        notes: "Bilingual, excellent patient educator"
      }
    ]
  },
  {
    id: "2",
    hireRequestId: "5",
    roleTitle: "Nurse Practitioner",
    department: "Primary Care",
    location: "Orlando, FL",
    status: "Awaiting Decision",
    dateSubmitted: "2024-05-28",
    estimatedStartDate: "2024-07-20",
    contractLength: "12 months",
    salaryRange: { min: 80000, max: 95000, currency: "USD" },
    timeLimit: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
    startTime: Date.now() - (6 * 60 * 60 * 1000), // Started 6 hours ago
    candidates: [
      {
        id: "6",
        name: "John Smith",
        avatarUrl: undefined,
        role: "Nurse Practitioner",
        pricePerMonth: 3500,
        currency: "USD",
        languages: ["English"],
        specializations: ["Primary Care"],
        skills: ["Diagnosis", "Patient Education", "Chronic Disease Management"],
        about: "Nurse practitioner with a passion for primary care and patient education.",
        experienceLevel: "Senior",
        email: "john.smith@email.com",
        phone: "+1 (407) 555-0106",
        experience: "8 years in primary care",
        certifications: ["NP License", "DEA Registration", "ANCC Board Certified"],
        availability: "Full-time, flexible schedule",
        notes: "Strong diagnostic skills, excellent patient educator"
      },
      {
        id: "7",
        name: "Dr. Maria Rodriguez",
        avatarUrl: undefined,
        role: "Nurse Practitioner",
        pricePerMonth: 3800,
        currency: "USD",
        languages: ["English", "Spanish"],
        specializations: ["Family Medicine"],
        skills: ["Pediatric Care", "Women's Health", "Geriatric Care"],
        about: "Family NP with comprehensive experience across all age groups.",
        experienceLevel: "Senior",
        email: "maria.rodriguez@email.com",
        phone: "+1 (407) 555-0107",
        experience: "10 years in family medicine",
        certifications: ["NP License", "DEA Registration", "FNP-BC"],
        availability: "Full-time, regular business hours",
        notes: "Bilingual, comprehensive family care experience"
      },
      {
        id: "8",
        name: "Amanda Foster",
        avatarUrl: undefined,
        role: "Nurse Practitioner",
        pricePerMonth: 3200,
        currency: "USD",
        languages: ["English"],
        specializations: ["Adult Health"],
        skills: ["Health Assessment", "Disease Prevention", "Health Promotion"],
        about: "Adult health NP with focus on preventive care and health promotion.",
        experienceLevel: "Mid",
        email: "amanda.foster@email.com",
        phone: "+1 (407) 555-0108",
        experience: "6 years in adult health",
        certifications: ["NP License", "DEA Registration", "ANP-BC"],
        availability: "Full-time, regular business hours",
        notes: "Specializes in preventive care"
      },
      {
        id: "9",
        name: "Robert Kim",
        avatarUrl: undefined,
        role: "Nurse Practitioner",
        pricePerMonth: 3600,
        currency: "USD",
        languages: ["English", "Korean"],
        specializations: ["Cardiology"],
        skills: ["Cardiac Assessment", "ECG Interpretation", "Patient Education"],
        about: "Cardiology NP with specialized training in cardiac assessment.",
        experienceLevel: "Senior",
        email: "robert.kim@email.com",
        phone: "+1 (407) 555-0109",
        experience: "9 years in cardiology",
        certifications: ["NP License", "DEA Registration", "CCRN"],
        availability: "Full-time, flexible schedule",
        notes: "Cardiology specialist"
      },
      {
        id: "10",
        name: "Lisa Thompson",
        avatarUrl: undefined,
        role: "Nurse Practitioner",
        pricePerMonth: 3400,
        currency: "USD",
        languages: ["English"],
        specializations: ["Women's Health"],
        skills: ["Gynecological Care", "Family Planning", "Prenatal Care"],
        about: "Women's health NP with expertise in gynecological and prenatal care.",
        experienceLevel: "Mid",
        email: "lisa.thompson@email.com",
        phone: "+1 (407) 555-0110",
        experience: "7 years in women's health",
        certifications: ["NP License", "DEA Registration", "WHNP-BC"],
        availability: "Full-time, regular business hours",
        notes: "Women's health specialist"
      }
    ]
  },
  {
    id: "3",
    hireRequestId: "11",
    roleTitle: "Physical Therapist",
    department: "Rehabilitation",
    location: "St. Petersburg, FL",
    status: "Panel Ready",
    dateSubmitted: "2024-05-26",
    estimatedStartDate: "2024-08-05",
    contractLength: "12 months",
    salaryRange: { min: 60000, max: 70000, currency: "USD" },
    timeLimit: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
    startTime: Date.now() - (2 * 60 * 60 * 1000), // Started 2 hours ago
    candidates: [
      {
        id: "11",
        name: "David Kim",
        avatarUrl: undefined,
        role: "Physical Therapist",
        pricePerMonth: 2500,
        currency: "USD",
        languages: ["English", "Korean"],
        specializations: ["Orthopedics", "Sports Medicine"],
        skills: ["Manual Therapy", "Exercise Prescription", "Patient Assessment"],
        about: "Physical therapist with expertise in orthopedic and sports medicine rehabilitation.",
        experienceLevel: "Senior",
        email: "david.kim@email.com",
        phone: "+1 (727) 555-0111",
        experience: "7 years in orthopedics",
        certifications: ["PT License", "OCS", "SCS"],
        availability: "Full-time, flexible schedule",
        notes: "Sports rehab specialist"
      },
      {
        id: "12",
        name: "Amanda Foster",
        avatarUrl: undefined,
        role: "Physical Therapist",
        pricePerMonth: 2400,
        currency: "USD",
        languages: ["English"],
        specializations: ["Pediatrics", "Rehabilitation"],
        skills: ["ADL Training", "Splinting", "Home Modifications"],
        about: "Physical therapist specializing in pediatric and rehabilitation services.",
        experienceLevel: "Senior",
        email: "amanda.foster@email.com",
        phone: "+1 (727) 555-0112",
        experience: "6 years in pediatrics",
        certifications: ["PT License", "PCS"],
        availability: "Full-time, regular business hours",
        notes: "Pediatric specialist"
      },
      {
        id: "13",
        name: "Robert Wilson",
        avatarUrl: undefined,
        role: "Physical Therapist",
        pricePerMonth: 2200,
        currency: "USD",
        languages: ["English"],
        specializations: ["Neurological Rehabilitation"],
        skills: ["Stroke Rehabilitation", "Balance Training", "Gait Training"],
        about: "PT with expertise in neurological rehabilitation and stroke recovery.",
        experienceLevel: "Mid",
        email: "robert.wilson@email.com",
        phone: "+1 (727) 555-0113",
        experience: "4 years in neuro rehab",
        certifications: ["PT License", "NCS"],
        availability: "Full-time, flexible schedule",
        notes: "Neurological rehabilitation specialist"
      },
      {
        id: "14",
        name: "Sarah Johnson",
        avatarUrl: undefined,
        role: "Physical Therapist",
        pricePerMonth: 2300,
        currency: "USD",
        languages: ["English", "Spanish"],
        specializations: ["Geriatrics", "Balance Training"],
        skills: ["Fall Prevention", "Mobility Training", "Home Safety"],
        about: "PT specializing in geriatric care and fall prevention.",
        experienceLevel: "Mid",
        email: "sarah.johnson@email.com",
        phone: "+1 (727) 555-0114",
        experience: "5 years in geriatrics",
        certifications: ["PT License", "GCS"],
        availability: "Full-time, regular business hours",
        notes: "Geriatric specialist"
      },
      {
        id: "15",
        name: "Michael Chen",
        avatarUrl: undefined,
        role: "Physical Therapist",
        pricePerMonth: 2600,
        currency: "USD",
        languages: ["English", "Mandarin"],
        specializations: ["Sports Medicine", "Athletic Training"],
        skills: ["Sports Rehabilitation", "Return to Sport", "Performance Training"],
        about: "Sports medicine PT with experience in athletic rehabilitation.",
        experienceLevel: "Senior",
        email: "michael.chen@email.com",
        phone: "+1 (727) 555-0115",
        experience: "8 years in sports medicine",
        certifications: ["PT License", "SCS", "ATC"],
        availability: "Full-time, flexible schedule",
        notes: "Sports medicine specialist"
      }
    ]
  },
  {
    id: "4",
    hireRequestId: "12",
    roleTitle: "Medical Assistant",
    department: "Family Medicine",
    location: "Tampa, FL",
    status: "Placement Complete",
    dateSubmitted: "2024-05-20",
    estimatedStartDate: "2024-07-01",
    contractLength: "12 months",
    salaryRange: { min: 32000, max: 38000, currency: "USD" },
    timeLimit: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
    startTime: Date.now() - (48 * 60 * 60 * 1000), // Started 48 hours ago (expired)
    selectedWinner: {
      id: "16",
      name: "Jessica Martinez",
      avatarUrl: undefined,
      role: "Medical Assistant",
      pricePerMonth: 1600,
      currency: "USD",
      languages: ["English", "Spanish"],
      specializations: ["Family Medicine"],
      skills: ["Phlebotomy", "Patient Scheduling", "Medical Records"],
      about: "Experienced medical assistant with excellent patient care skills.",
      experienceLevel: "Mid",
      email: "jessica.martinez@email.com",
      phone: "+1 (813) 555-0116",
      experience: "4 years in family medicine",
      certifications: ["MA Certificate", "Phlebotomy Certified"],
      availability: "Full-time, regular business hours",
      notes: "Bilingual, excellent patient interaction skills"
    },
    candidates: [
      {
        id: "16",
        name: "Jessica Martinez",
        avatarUrl: undefined,
        role: "Medical Assistant",
        pricePerMonth: 1600,
        currency: "USD",
        languages: ["English", "Spanish"],
        specializations: ["Family Medicine"],
        skills: ["Phlebotomy", "Patient Scheduling", "Medical Records"],
        about: "Experienced medical assistant with excellent patient care skills.",
        experienceLevel: "Mid",
        email: "jessica.martinez@email.com",
        phone: "+1 (813) 555-0116",
        experience: "4 years in family medicine",
        certifications: ["MA Certificate", "Phlebotomy Certified"],
        availability: "Full-time, regular business hours",
        notes: "Bilingual, excellent patient interaction skills"
      },
      {
        id: "17",
        name: "Alex Rodriguez",
        avatarUrl: undefined,
        role: "Medical Assistant",
        pricePerMonth: 1500,
        currency: "USD",
        languages: ["English", "Spanish"],
        specializations: ["Primary Care"],
        skills: ["Vital Signs", "Patient Prep", "Medical Records"],
        about: "Dedicated medical assistant with strong organizational skills.",
        experienceLevel: "Mid",
        email: "alex.rodriguez@email.com",
        phone: "+1 (813) 555-0117",
        experience: "3 years in primary care",
        certifications: ["MA Certificate"],
        availability: "Full-time, flexible schedule",
        notes: "Great team player, organized"
      },
      {
        id: "18",
        name: "Rachel Green",
        avatarUrl: undefined,
        role: "Medical Assistant",
        pricePerMonth: 1700,
        currency: "USD",
        languages: ["English"],
        specializations: ["Internal Medicine"],
        skills: ["EKG", "Phlebotomy", "Patient Education"],
        about: "Medical assistant with specialized training in internal medicine.",
        experienceLevel: "Senior",
        email: "rachel.green@email.com",
        phone: "+1 (813) 555-0118",
        experience: "6 years in internal medicine",
        certifications: ["MA Certificate", "EKG Certified"],
        availability: "Full-time, regular business hours",
        notes: "EKG specialist, patient educator"
      },
      {
        id: "19",
        name: "Daniel Lee",
        avatarUrl: undefined,
        role: "Medical Assistant",
        pricePerMonth: 1400,
        currency: "USD",
        languages: ["English", "Korean"],
        specializations: ["Pediatrics"],
        skills: ["Child Care", "Immunizations", "Growth Charts"],
        about: "Medical assistant specializing in pediatric care.",
        experienceLevel: "Mid",
        email: "daniel.lee@email.com",
        phone: "+1 (813) 555-0119",
        experience: "3 years in pediatrics",
        certifications: ["MA Certificate", "Pediatric Training"],
        availability: "Full-time, regular business hours",
        notes: "Great with children, immunization specialist"
      },
      {
        id: "20",
        name: "Sofia Hernandez",
        avatarUrl: undefined,
        role: "Medical Assistant",
        pricePerMonth: 1550,
        currency: "USD",
        languages: ["English", "Spanish"],
        specializations: ["Urgent Care"],
        skills: ["Triage", "Wound Care", "Emergency Procedures"],
        about: "Medical assistant with urgent care experience.",
        experienceLevel: "Mid",
        email: "sofia.hernandez@email.com",
        phone: "+1 (813) 555-0120",
        experience: "4 years in urgent care",
        certifications: ["MA Certificate", "BLS"],
        availability: "Full-time, rotating shifts",
        notes: "Urgent care specialist, triage experience"
      }
    ]
  }
];

// Importa los mocks de hire requests
const hireRequests: HireRequest[] = [
  {
    id: "1",
    role: "Registered Nurse",
    roleTitle: "Registered Nurse",
    department: "Emergency",
    practiceArea: "General Medicine",
    scheduleNeeds: "Full-time (40 hours/week)",
    location: "Miami, FL",
    requiredSkills: ["IV Therapy", "Patient Care", "BLS Certified"],
    keyResponsibilities: "Provide patient care, administer IVs, monitor vitals.",
    priority: "High",
    estimatedStartDate: "2024-07-01",
    contractLength: "12 months",
    remoteWork: "No",
    travelRequired: "No",
    certifications: ["RN License", "BLS"],
    experienceLevel: "Mid",
    salaryRange: { min: 50000, max: 60000, currency: "USD" },
    benefits: ["Health Insurance", "Paid Time Off"],
    additionalNotes: "Night shift availability required.",
    status: "New",
    dateSubmitted: "2024-06-01",
    description: "Full-time RN for ER department"
  },
  {
    id: "2",
    role: "Medical Assistant",
    roleTitle: "Medical Assistant",
    department: "Family Medicine",
    practiceArea: "Primary Care",
    scheduleNeeds: "Part-time (20 hours/week)",
    location: "Fort Lauderdale, FL",
    requiredSkills: ["Phlebotomy", "Patient Scheduling"],
    keyResponsibilities: "Assist with patient intake, scheduling, and phlebotomy.",
    priority: "Medium",
    estimatedStartDate: "2024-07-10",
    contractLength: "6 months",
    remoteWork: "No",
    travelRequired: "No",
    certifications: ["MA Certificate"],
    experienceLevel: "Entry",
    salaryRange: { min: 32000, max: 38000, currency: "USD" },
    benefits: ["Health Insurance"],
    additionalNotes: "Spanish speaking preferred.",
    status: "Sourcing",
    dateSubmitted: "2024-05-31",
    description: "Part-time MA for family practice"
  },
  {
    id: "3",
    role: "Lab Technician",
    roleTitle: "Lab Technician",
    department: "Laboratory",
    practiceArea: "Diagnostics",
    scheduleNeeds: "Full-time (40 hours/week)",
    location: "West Palm Beach, FL",
    requiredSkills: ["Blood Analysis", "Lab Safety"],
    keyResponsibilities: "Perform blood tests and ensure lab safety.",
    priority: "Low",
    estimatedStartDate: "2024-08-01",
    contractLength: "12 months",
    remoteWork: "No",
    travelRequired: "No",
    certifications: ["Lab Tech Certificate"],
    experienceLevel: "Mid",
    salaryRange: { min: 40000, max: 48000, currency: "USD" },
    benefits: ["Paid Time Off"],
    additionalNotes: "Weekend rotation required.",
    status: "Interview Scheduled",
    dateSubmitted: "2024-05-30",
    description: "Full-time lab tech for diagnostics"
  },
  {
    id: "4",
    role: "Receptionist",
    roleTitle: "Receptionist",
    department: "Front Desk",
    practiceArea: "Administration",
    scheduleNeeds: "Full-time (40 hours/week)",
    location: "Tampa, FL",
    requiredSkills: ["Customer Service", "Multi-line Phone System"],
    keyResponsibilities: "Greet patients, answer phones, schedule appointments.",
    priority: "Medium",
    estimatedStartDate: "2024-07-15",
    contractLength: "12 months",
    remoteWork: "No",
    travelRequired: "No",
    certifications: ["Office Admin Certificate"],
    experienceLevel: "Entry",
    salaryRange: { min: 30000, max: 35000, currency: "USD" },
    benefits: ["Health Insurance"],
    additionalNotes: "Bilingual preferred.",
    status: "Placement Complete",
    dateSubmitted: "2024-05-29",
    description: "Receptionist for busy front desk"
  },
  {
    id: "5",
    role: "Nurse Practitioner",
    roleTitle: "Nurse Practitioner",
    department: "Primary Care",
    practiceArea: "General Medicine",
    scheduleNeeds: "Full-time (40 hours/week)",
    location: "Orlando, FL",
    requiredSkills: ["Diagnosis", "Patient Education"],
    keyResponsibilities: "Diagnose and treat patients, provide education.",
    priority: "High",
    estimatedStartDate: "2024-07-20",
    contractLength: "12 months",
    remoteWork: "No",
    travelRequired: "No",
    certifications: ["NP License"],
    experienceLevel: "Senior",
    salaryRange: { min: 80000, max: 95000, currency: "USD" },
    benefits: ["Health Insurance", "Retirement Plan"],
    additionalNotes: "Leadership experience preferred.",
    status: "Awaiting Decision",
    dateSubmitted: "2024-05-28",
    description: "NP for primary care clinic"
  },
  {
    id: "6",
    role: "Pharmacist",
    roleTitle: "Pharmacist",
    department: "Pharmacy",
    practiceArea: "Clinical Pharmacy",
    scheduleNeeds: "Full-time (40 hours/week)",
    location: "Jacksonville, FL",
    requiredSkills: ["Medication Review", "Drug Interactions"],
    keyResponsibilities: "Review medications, check for interactions.",
    priority: "Medium",
    estimatedStartDate: "2024-07-25",
    contractLength: "12 months",
    remoteWork: "No",
    travelRequired: "No",
    certifications: ["Pharmacist License"],
    experienceLevel: "Senior",
    salaryRange: { min: 70000, max: 85000, currency: "USD" },
    benefits: ["Health Insurance", "Paid Time Off"],
    additionalNotes: "Experience with hospital pharmacy preferred.",
    status: "Panel Ready",
    dateSubmitted: "2024-05-27",
    description: "Pharmacist for hospital pharmacy"
  },
  {
    id: "7",
    role: "Physical Therapist",
    roleTitle: "Physical Therapist",
    department: "Rehabilitation",
    practiceArea: "Orthopedics",
    scheduleNeeds: "Full-time (40 hours/week)",
    location: "St. Petersburg, FL",
    requiredSkills: ["Manual Therapy", "Exercise Prescription"],
    keyResponsibilities: "Provide physical therapy, prescribe exercises.",
    priority: "Low",
    estimatedStartDate: "2024-08-05",
    contractLength: "12 months",
    remoteWork: "No",
    travelRequired: "No",
    certifications: ["PT License"],
    experienceLevel: "Mid",
    salaryRange: { min: 60000, max: 70000, currency: "USD" },
    benefits: ["Health Insurance"],
    additionalNotes: "Sports rehab experience a plus.",
    status: "Sourcing",
    dateSubmitted: "2024-05-26",
    description: "PT for ortho rehab"
  },
  {
    id: "8",
    role: "Medical Social Worker",
    roleTitle: "Medical Social Worker",
    department: "Social Services",
    practiceArea: "Case Management",
    scheduleNeeds: "Full-time (40 hours/week)",
    location: "Hialeah, FL",
    requiredSkills: ["Patient Advocacy", "Resource Coordination"],
    keyResponsibilities: "Advocate for patients, coordinate resources.",
    priority: "Medium",
    estimatedStartDate: "2024-08-10",
    contractLength: "12 months",
    remoteWork: "No",
    travelRequired: "No",
    certifications: ["MSW"],
    experienceLevel: "Mid",
    salaryRange: { min: 45000, max: 55000, currency: "USD" },
    benefits: ["Health Insurance"],
    additionalNotes: "Bilingual preferred.",
    status: "New",
    dateSubmitted: "2024-05-25",
    description: "Social worker for hospital"
  },
  {
    id: "9",
    role: "Surgical Technologist",
    roleTitle: "Surgical Technologist",
    department: "Surgery",
    practiceArea: "Operating Room",
    scheduleNeeds: "Full-time (40 hours/week)",
    location: "Cape Coral, FL",
    requiredSkills: ["Surgical Procedures", "Sterile Technique"],
    keyResponsibilities: "Assist in surgeries, maintain sterile field.",
    priority: "High",
    estimatedStartDate: "2024-08-15",
    contractLength: "12 months",
    remoteWork: "No",
    travelRequired: "No",
    certifications: ["Surgical Tech Certificate"],
    experienceLevel: "Mid",
    salaryRange: { min: 50000, max: 60000, currency: "USD" },
    benefits: ["Health Insurance"],
    additionalNotes: "Experience in ortho preferred.",
    status: "Canceled",
    dateSubmitted: "2024-05-24",
    description: "Surgical tech for OR"
  },
  {
    id: "10",
    role: "Occupational Therapist",
    roleTitle: "Occupational Therapist",
    department: "Occupational Therapy",
    practiceArea: "Rehabilitation",
    scheduleNeeds: "Full-time (40 hours/week)",
    location: "Fort Myers, FL",
    requiredSkills: ["ADL Training", "Splinting"],
    keyResponsibilities: "Help patients with daily living activities.",
    priority: "Low",
    estimatedStartDate: "2024-08-20",
    contractLength: "12 months",
    remoteWork: "No",
    travelRequired: "No",
    certifications: ["OT License"],
    experienceLevel: "Senior",
    salaryRange: { min: 65000, max: 80000, currency: "USD" },
    benefits: ["Health Insurance"],
    additionalNotes: "Pediatrics experience a plus.",
    status: "Placement Complete",
    dateSubmitted: "2024-05-23",
    description: "OT for rehab center"
  },
  {
    id: "11",
    role: "Physical Therapist",
    roleTitle: "Physical Therapist",
    department: "Rehabilitation",
    practiceArea: "Orthopedics",
    scheduleNeeds: "Full-time (40 hours/week)",
    location: "St. Petersburg, FL",
    requiredSkills: ["Manual Therapy", "Exercise Prescription"],
    keyResponsibilities: "Provide physical therapy, prescribe exercises.",
    priority: "Low",
    estimatedStartDate: "2024-08-05",
    contractLength: "12 months",
    remoteWork: "No",
    travelRequired: "No",
    certifications: ["PT License"],
    experienceLevel: "Mid",
    salaryRange: { min: 60000, max: 70000, currency: "USD" },
    benefits: ["Health Insurance"],
    additionalNotes: "Sports rehab experience a plus.",
    status: "Panel Ready",
    dateSubmitted: "2024-05-26",
    description: "PT for ortho rehab"
  },
  {
    id: "12",
    role: "Medical Assistant",
    roleTitle: "Medical Assistant",
    department: "Family Medicine",
    practiceArea: "Primary Care",
    scheduleNeeds: "Part-time (20 hours/week)",
    location: "Tampa, FL",
    requiredSkills: ["Phlebotomy", "Patient Scheduling"],
    keyResponsibilities: "Assist with patient intake, scheduling, and phlebotomy.",
    priority: "Medium",
    estimatedStartDate: "2024-07-01",
    contractLength: "6 months",
    remoteWork: "No",
    travelRequired: "No",
    certifications: ["MA Certificate"],
    experienceLevel: "Entry",
    salaryRange: { min: 32000, max: 38000, currency: "USD" },
    benefits: ["Health Insurance"],
    additionalNotes: "Spanish speaking preferred.",
    status: "Placement Complete",
    dateSubmitted: "2024-05-20",
    description: "Part-time MA for family practice"
  }
];

// Status configuration
const STATUS_CONFIG = {
  "New": {
    color: "bg-muted-foreground text-primary-foreground",
    icon: <Info className="w-4 h-4" />,
    description: "New request submitted"
  },
  "Sourcing": {
    color: "bg-primary text-primary-foreground",
    icon: <Info className="w-4 h-4" />,
    description: "Sourcing candidates"
  },
  "Panel Ready": {
    color: "bg-chart-3 text-primary-foreground",
    icon: <Users className="w-4 h-4" />,
    description: "Ready for candidate review"
  },
  "Interview Scheduled": {
    color: "bg-chart-5 text-primary-foreground",
    icon: <Info className="w-4 h-4" />,
    description: "Interview scheduled"
  },
  "Awaiting Decision": {
    color: "bg-chart-4 text-primary-foreground",
    icon: <Calendar className="w-4 h-4" />,
    description: "Waiting for client decision"
  },
  "Placement Complete": {
    color: "bg-chart-2 text-primary-foreground",
    icon: <CheckCircle className="w-4 h-4" />,
    description: "Placement complete"
  },
  "Canceled": {
    color: "bg-destructive text-primary-foreground",
    icon: <Info className="w-4 h-4" />,
    description: "Request canceled"
  }
};

// Countdown Timer Component
const CountdownTimer = ({ panel }: { panel: InterviewPanel }) => {
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = Date.now();
      const elapsed = now - panel.startTime;
      const remaining = Math.max(0, panel.timeLimit - elapsed);
      setTimeLeft(remaining);
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(interval);
  }, [panel]);

  const formatTime = (milliseconds: number) => {
    if (milliseconds <= 0) {
      return "00:00:00";
    }

    const hours = Math.floor(milliseconds / (1000 * 60 * 60));
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000);

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const isExpired = timeLeft <= 0;
  const isWarning = timeLeft <= 60 * 60 * 1000; // 1 hour warning

  return (
    <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${
      isExpired 
        ? 'bg-destructive/10 text-destructive border-destructive/20' 
        : isWarning 
        ? 'bg-chart-3/10 text-chart-3 border-chart-3/20' 
        : 'bg-primary/10 text-primary border-primary/20'
    }`}>
      <Clock className={`w-4 h-4 ${isExpired ? 'text-destructive' : isWarning ? 'text-chart-3' : 'text-primary'}`} />
      <span className="font-mono font-semibold text-sm">
        {isExpired ? 'Time Expired' : formatTime(timeLeft)}
      </span>
    </div>
  );
};

export default function InterviewPanelsPage() {
  const [selectedPanel, setSelectedPanel] = useState<InterviewPanel | null>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [viewCandidateOpen, setViewCandidateOpen] = useState(false);
  const [selectWinnerOpen, setSelectWinnerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [viewHireRequestOpen, setViewHireRequestOpen] = useState(false);
  const [selectedHireRequest, setSelectedHireRequest] = useState<HireRequest | null>(null);

  // Filter panels based on search and status
  const filteredPanels = interviewPanels.filter(panel => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    const matchesSearch =
      !normalizedSearch ||
      panel.roleTitle.toLowerCase().includes(normalizedSearch) ||
      panel.department.toLowerCase().includes(normalizedSearch) ||
      panel.location.toLowerCase().includes(normalizedSearch);
    const matchesStatus = statusFilter === "all" || panel.status === statusFilter;
    return matchesSearch && matchesStatus;
  }).sort((a, b) => {
    // Sort by priority: Awaiting Decision first, then Panel Ready, then Placement Complete
    const priorityOrder = { "Awaiting Decision": 1, "Panel Ready": 2, "Placement Complete": 3 };
    const aPriority = priorityOrder[a.status] || 4;
    const bPriority = priorityOrder[b.status] || 4;
    return aPriority - bPriority;
  });

  const handleViewCandidate = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setViewCandidateOpen(true);
  };

  const handleSelectWinner = (candidate: Candidate, panel: InterviewPanel) => {
    setSelectedCandidate(candidate);
    setSelectedPanel(panel);
    setSelectWinnerOpen(true);
  };

  const confirmSelectWinner = async () => {
    if (selectedCandidate && selectedPanel) {
      setIsLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update panel status
      selectedPanel.status = "Placement Complete";
      selectedPanel.selectedWinner = selectedCandidate;
      
      toast.success(`${selectedCandidate.name} has been selected as the winner for ${selectedPanel.roleTitle}!`);
      setSelectWinnerOpen(false);
      setSelectedCandidate(null);
      setSelectedPanel(null);
      setIsLoading(false);
    }
  };

  const handleViewHireRequest = (panel: InterviewPanel) => {
    const req = hireRequests.find(r => r.id === panel.hireRequestId) || null;
    setSelectedHireRequest(req);
    setViewHireRequestOpen(true);
  };

  const CandidateCard = ({ candidate, panel }: { candidate: Candidate; panel: InterviewPanel }) => {
    const isWinner = panel.selectedWinner?.id === candidate.id;
    
    return (
      <Card className={`p-4 border transition-colors cursor-pointer flex flex-col h-full justify-between ${
        isWinner 
          ? 'border-chart-2 bg-chart-2/5 hover:border-chart-2/70' 
          : 'border-border hover:border-primary/30'
      }`} onClick={() => handleViewCandidate(candidate)}>
        <div>
          <div className="flex items-start gap-3 mb-3">
            <Avatar name={candidate.name} src={candidate.avatarUrl} className="w-12 h-12 text-lg" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h4 className="font-semibold text-sm text-foreground truncate">{candidate.name}</h4>
                {isWinner && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 text-yellow-700 px-2 py-0.5 text-xs font-semibold">
                    <Crown className="w-4 h-4 text-yellow-500" />
                    Winner
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground">{candidate.role}</p>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="text-xs">
                  {candidate.experienceLevel}
                </Badge>
              </div>
            </div>
          </div>
          <div className="mb-3">
            <div className="text-sm font-semibold text-primary">
              {candidate.currency === "USD" ? "$" : candidate.currency}
              {candidate.pricePerMonth.toLocaleString()}/month
            </div>
          </div>
        </div>
        {panel.status !== "Placement Complete" && (
          <Button
            size="default"
            variant="default"
            onClick={(e) => { e.stopPropagation(); handleSelectWinner(candidate, panel); }}
            aria-label="Select Winner"
            className="w-full mt-auto"
            disabled={panel.status === "Panel Ready"}
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Select Winner
          </Button>
        )}
      </Card>
    );
  };

  const InterviewPanelCard = ({ panel }: { panel: InterviewPanel }) => {
    return (
      <Card className="p-6 border border-border">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-lg font-semibold text-foreground">{panel.roleTitle}</h3>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              {panel.estimatedStartDate && (
                <>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Interview on {panel.estimatedStartDate} 14:00
                  </div>
                  <Button size="sm" variant="outline" className="ml-2" onClick={() => handleViewHireRequest(panel)}>
                    <Eye className="w-4 h-4 mr-1" />
                    View Request Details
                  </Button>
                </>
              )}
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Badge className={STATUS_CONFIG[panel.status].color}>
              {STATUS_CONFIG[panel.status].icon}
              {panel.status}
            </Badge>
            {panel.status === "Awaiting Decision" && <CountdownTimer panel={panel} />}
          </div>
        </div>
        <div className="mb-4">
          {panel.selectedWinner && (
            <div className="text-sm text-chart-2 font-medium mb-2 flex items-center gap-2">
              <Crown className="w-4 h-4 text-yellow-500" />
              {panel.selectedWinner.name} selected as winner
            </div>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {panel.candidates.map((candidate) => (
            <CandidateCard key={candidate.id} candidate={candidate} panel={panel} />
          ))}
        </div>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-background flex">
      <main className="flex-1 p-6 md:p-10 w-full max-w-none px-4 sm:px-8">
        <PageTitle 
          title="Interview Panels" 
        />
        <p className="text-muted-foreground mb-8">Review and select the best candidates for your open positions</p>
        
        {/* Search and Filter Section */}
        <div className="max-w-7xl mx-auto mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Input
                className="w-full sm:w-64"
                placeholder="Search by role, department, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="Panel Ready">Panel Ready</SelectItem>
                  <SelectItem value="Awaiting Decision">Awaiting Decision</SelectItem>
                  <SelectItem value="Placement Complete">Placement Complete</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto">
          {filteredPanels.length === 0 ? (
            <Card className="p-12 text-center">
              <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No Interview Panels Found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || statusFilter !== "all" 
                  ? "Try adjusting your search or filter criteria."
                  : "Interview panels will appear here when candidates are ready for your review."
                }
              </p>
            </Card>
          ) : (
            <div className="space-y-6">
              {filteredPanels.map((panel) => (
                <InterviewPanelCard key={panel.id} panel={panel} />
              ))}
            </div>
          )}
        </div>

        {/* View Candidate Details Sheet */}
        <Sheet open={viewCandidateOpen} onOpenChange={setViewCandidateOpen}>
          <SheetContent side="right" className="w-[40vw] min-w-[400px] max-w-[48rem] p-0">
            {selectedCandidate && (
              <div className="relative h-full flex flex-col">
                <div className="sticky top-0 z-10 bg-background px-6 pt-6 pb-4 shadow-sm border-b flex items-center gap-4">
                  <Avatar name={selectedCandidate.name} src={selectedCandidate.avatarUrl} className="w-14 h-14 text-2xl" />
                  <div className="flex-1 min-w-0">
                    <h2 className="text-2xl font-bold">{selectedCandidate.name}</h2>
                    <div className="text-lg text-muted-foreground font-medium">{selectedCandidate.role}</div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="text-primary text-xl font-bold">
                      {selectedCandidate.currency === "USD" ? "$" : selectedCandidate.currency}
                      {selectedCandidate.pricePerMonth.toLocaleString()}
                    </span>
                    <span className="text-sm text-muted-foreground">/month</span>
                  </div>
                </div>
                
                <div className="flex-1 overflow-y-auto px-6 pb-6 pt-2 flex flex-col gap-4">
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Badge variant="outline" className="bg-chart-2/10 text-chart-2 border-chart-2/20">
                      {selectedCandidate.experienceLevel}
                    </Badge>
                    {selectedCandidate.languages.map((lang) => (
                      <Badge key={lang} variant="outline" className="text-xs">
                        {lang}
                      </Badge>
                    ))}
                  </div>

                  {/* Contact Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedCandidate.email && (
                      <div>
                        <div className="font-semibold text-sm text-foreground mb-1">Email</div>
                        <div className="text-sm text-muted-foreground">{selectedCandidate.email}</div>
                      </div>
                    )}
                    {selectedCandidate.phone && (
                      <div>
                        <div className="font-semibold text-sm text-foreground mb-1">Phone</div>
                        <div className="text-sm text-muted-foreground">{selectedCandidate.phone}</div>
                      </div>
                    )}
                  </div>

                  {/* Experience & Availability */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedCandidate.experience && (
                      <div>
                        <div className="font-semibold text-sm text-foreground mb-1">Experience</div>
                        <div className="text-sm text-muted-foreground">{selectedCandidate.experience}</div>
                      </div>
                    )}
                    {selectedCandidate.availability && (
                      <div>
                        <div className="font-semibold text-sm text-foreground mb-1">Availability</div>
                        <div className="text-sm text-muted-foreground">{selectedCandidate.availability}</div>
                      </div>
                    )}
                  </div>

                  {/* Specializations */}
                  {selectedCandidate.specializations && selectedCandidate.specializations.length > 0 && (
                    <div>
                      <div className="font-semibold text-sm text-foreground mb-2">Specializations</div>
                      <div className="flex flex-wrap gap-2">
                        {selectedCandidate.specializations.map((spec) => (
                          <Badge key={spec} variant="secondary" className="text-xs">
                            {spec}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Skills */}
                  {selectedCandidate.skills && selectedCandidate.skills.length > 0 && (
                    <div>
                      <div className="font-semibold text-sm text-foreground mb-2">Skills</div>
                      <div className="flex flex-wrap gap-2">
                        {selectedCandidate.skills.map((skill) => (
                          <Badge key={skill} variant="outline" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Certifications */}
                  {selectedCandidate.certifications && selectedCandidate.certifications.length > 0 && (
                    <div>
                      <div className="font-semibold text-sm text-foreground mb-2">Certifications</div>
                      <div className="flex flex-wrap gap-2">
                        {selectedCandidate.certifications.map((cert) => (
                          <Badge key={cert} variant="outline" className="text-xs bg-primary/10 text-primary border-primary/20">
                            {cert}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* About */}
                  <div>
                    <div className="font-semibold text-sm text-foreground mb-1">About</div>
                    <div className="text-sm text-muted-foreground bg-muted p-3 rounded-lg">
                      {selectedCandidate.about}
                    </div>
                  </div>

                  {/* Notes */}
                  {selectedCandidate.notes && (
                    <div>
                      <div className="font-semibold text-sm text-foreground mb-1">Notes</div>
                      <div className="text-sm text-muted-foreground bg-muted p-3 rounded-lg">
                        {selectedCandidate.notes}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </SheetContent>
        </Sheet>

        {/* Select Winner Confirmation Dialog */}
        <Dialog open={selectWinnerOpen} onOpenChange={setSelectWinnerOpen}>
          <DialogContent className="max-w-md w-full">
            <DialogHeader>
              <DialogTitle>Select {selectedCandidate?.name} as Winner?</DialogTitle>
              <DialogDescription>
                Are you sure you want to select {selectedCandidate?.name} as the winner for the {selectedPanel?.roleTitle} position? This will complete the placement process.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setSelectWinnerOpen(false)} disabled={isLoading}>
                Cancel
              </Button>
              <Button onClick={confirmSelectWinner} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Confirm Selection
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Modal de detalles de hire request */}
        <Sheet open={viewHireRequestOpen} onOpenChange={setViewHireRequestOpen}>
          <SheetContent side="right" className="w-[40vw] min-w-[400px] max-w-[48rem] p-0">
            {selectedHireRequest && (
              <div className="relative h-full flex flex-col">
                <div className="sticky top-0 z-10 bg-background px-6 pt-6 pb-4 shadow-sm border-b flex items-center justify-between gap-2">
                  <div>
                    <h2 className="text-2xl font-bold">{selectedHireRequest.roleTitle}</h2>
                    <div className="text-lg text-muted-foreground font-medium">{selectedHireRequest.department}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={STATUS_CONFIG[selectedHireRequest.status as keyof typeof STATUS_CONFIG]?.color || "bg-muted text-primary-foreground"}>
                      {selectedHireRequest.status}
                    </Badge>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto px-6 pb-6 pt-2">
                  {/* Main Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 mb-6">
                    <div>
                      <div className="font-semibold text-sm text-foreground mb-1">Role Title</div>
                      <div className="font-normal text-base text-muted-foreground">{selectedHireRequest.roleTitle}</div>
                    </div>
                    <div>
                      <div className="font-semibold text-sm text-foreground mb-1">Practice Area</div>
                      <div className="font-normal text-base text-muted-foreground">{selectedHireRequest.practiceArea}</div>
                    </div>
                    <div>
                      <div className="font-semibold text-sm text-foreground mb-1">Schedule Needs</div>
                      <div className="font-normal text-base text-muted-foreground">{selectedHireRequest.scheduleNeeds}</div>
                    </div>
                    <div className="md:col-span-2">
                      <div className="font-semibold text-sm text-foreground mb-2">Required Skills</div>
                      <div className="flex flex-wrap gap-2">
                        {selectedHireRequest.requiredSkills.map((skill: string, index: number) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <div className="font-semibold text-sm text-foreground mb-2">Key Responsibilities</div>
                      <div className="bg-muted p-4 rounded-lg">
                        <p className="text-sm text-muted-foreground leading-relaxed">{selectedHireRequest.keyResponsibilities}</p>
                      </div>
                    </div>
                  </div>
                  {/* Divider */}
                  <div className="border-t border-border my-6" />
                  {/* More Details Section */}
                  <div className="mb-6">
                    <div className="font-semibold text-base text-foreground mb-2">More Details</div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                      <div>
                        <div className="font-semibold text-sm text-foreground mb-1">Department</div>
                        <div className="font-normal text-base text-muted-foreground">{selectedHireRequest.department}</div>
                      </div>
                      <div>
                        <div className="font-semibold text-sm text-foreground mb-1">Location</div>
                        <div className="font-normal text-base text-muted-foreground">{selectedHireRequest.location}</div>
                      </div>
                      <div>
                        <div className="font-semibold text-sm text-foreground mb-1">Experience Level</div>
                        <div className="font-normal text-base text-muted-foreground">{selectedHireRequest.experienceLevel}</div>
                      </div>
                      <div>
                        <div className="font-semibold text-sm text-foreground mb-1">Priority</div>
                        <Badge variant="outline" className={
                          selectedHireRequest.priority === "High" ? "border-destructive text-destructive" :
                          selectedHireRequest.priority === "Medium" ? "border-chart-3 text-chart-3" :
                          "border-chart-2 text-chart-2"
                        }>
                          {selectedHireRequest.priority}
                        </Badge>
                      </div>
                      <div>
                        <div className="font-semibold text-sm text-foreground mb-1">Remote Work</div>
                        <div className="font-normal text-base text-muted-foreground">{selectedHireRequest.remoteWork}</div>
                      </div>
                      <div>
                        <div className="font-semibold text-sm text-foreground mb-1">Date Submitted</div>
                        <div className="font-normal text-base text-muted-foreground">{selectedHireRequest.dateSubmitted}</div>
                      </div>
                      <div>
                        <div className="font-semibold text-sm text-foreground mb-1">Estimated Start Date</div>
                        <div className="font-normal text-base text-muted-foreground">{selectedHireRequest.estimatedStartDate || "Not specified"}</div>
                      </div>
                      <div>
                        <div className="font-semibold text-sm text-foreground mb-1">Contract Length</div>
                        <div className="font-normal text-base text-muted-foreground">{selectedHireRequest.contractLength || "Not specified"}</div>
                      </div>
                      <div>
                        <div className="font-semibold text-sm text-foreground mb-1">Travel Required</div>
                        <div className="font-normal text-base text-muted-foreground">{selectedHireRequest.travelRequired}</div>
                      </div>
                      <div>
                        <div className="font-semibold text-sm text-foreground mb-1">Salary Range</div>
                        <div className="font-normal text-base text-muted-foreground">
                          {selectedHireRequest.salaryRange ? (
                            `${selectedHireRequest.salaryRange.currency === "USD" ? "$" : selectedHireRequest.salaryRange.currency}
                            ${selectedHireRequest.salaryRange.min.toLocaleString()} - ${selectedHireRequest.salaryRange.max.toLocaleString()}`
                          ) : "Not specified"}
                        </div>
                      </div>
                      <div>
                        <div className="font-semibold text-sm text-foreground mb-1">Required Certifications</div>
                        <div className="flex flex-wrap gap-2">
                          {selectedHireRequest.certifications && selectedHireRequest.certifications.length > 0 ? (
                            selectedHireRequest.certifications.map((cert: string, idx: number) => (
                              <Badge key={idx} variant="secondary" className="text-xs">{cert}</Badge>
                            ))
                          ) : (
                            <div className="text-sm text-muted-foreground">No certifications specified</div>
                          )}
                        </div>
                      </div>
                      <div>
                        <div className="font-semibold text-sm text-foreground mb-1">Benefits</div>
                        <div className="flex flex-wrap gap-2">
                          {selectedHireRequest.benefits && selectedHireRequest.benefits.length > 0 ? (
                            selectedHireRequest.benefits.map((benefit: string, idx: number) => (
                              <Badge key={idx} variant="secondary" className="text-xs">{benefit}</Badge>
                            ))
                          ) : (
                            <div className="text-sm text-muted-foreground">No benefits specified</div>
                          )}
                        </div>
                      </div>
                      <div className="md:col-span-2">
                        <div className="font-semibold text-sm text-foreground mb-1">Additional Notes</div>
                        <div className="font-normal text-base text-muted-foreground">
                          {selectedHireRequest.additionalNotes || "No additional notes"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </SheetContent>
        </Sheet>
      </main>
    </div>
  );
} 