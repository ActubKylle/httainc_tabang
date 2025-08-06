<!DOCTYPE html>
<html lang="en">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>Learner Registration Form</title>
    <style>
        @page { margin: 0.4in; }
        body { font-family: 'Helvetica', 'Arial', sans-serif; font-size: 8.5pt; color: #000; }
        table { width: 100%; border-collapse: collapse; }
        td, th { padding: 1px 2px; vertical-align: top; }
        .header-logo { width: 65px; height: 65px; }
        .header-title { font-size: 11pt; font-weight: bold; text-align: center; }
        .header-subtitle { font-size: 9pt; text-align: center; margin:0; padding:0; line-height: 1.1; }
        .form-id { text-align: right; font-weight: bold; font-size: 10pt; }
        .section-title { font-weight: bold; font-size: 9.5pt; background-color: #e0e0e0; padding: 2px 4px; border: 1.5px solid #000; }
        .bordered-box { border: 1.5px solid #000; }
        .label { font-size: 6.5pt; text-align: center; font-style: italic; padding-top: 0; }
        .value { font-weight: bold; font-size: 8.5pt; text-align: center; border-bottom: 1px solid #000; height: 13px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .check-item { font-size: 8pt; line-height: 1.4; }
        .checkbox { display: inline-block; width: 8px; height: 8px; border: 1px solid #000; text-align: center; line-height: 8px; font-weight: bold; margin-right: 4px; vertical-align: middle; }
        .image-box { width: 96px; height: 96px; border: 1.5px solid #000; text-align: center; color: #999; }
        .image-box img { max-width: 100%; max-height: 100%; object-fit: cover; }
        .thumb-box { width: 96px; height: 96px; border: 1.5px solid #000; margin: 0 auto; text-align: center; color: #999; }
        .thumb-box img { max-width: 100%; max-height: 100%; object-fit: contain; }
        .no-border-table td, .no-border-table th { border: none; }
        .page-break { page-break-before: always; }
    </style>
</head>
<body>

    <table class="no-border-table">
        <tr>
            <td style="width: 20%; text-align: center;">
                 @if(!empty($learner->logo_base64))
                    <img src="{{ $learner->logo_base64 }}" alt="TESDA Logo" class="header-logo">
                @endif
            </td>
            <td style="width: 60%; vertical-align: middle;">
                <p class="header-subtitle">Technical Education and Skills Development Authority</p>
                <p class="header-subtitle">Pangasiwaan sa Edukasyong Teknikal at Pagpapaunlad ng Kasanayan</p>
                <p class="header-title">LEARNERS PROFILE FORM</p>
            </td>
            <td style="width: 20%; vertical-align: top;" class="form-id">
                MIS 03-01<br>(ver. 2021)
            </td>
        </tr>
    </table>

    <table class="no-border-table" style="margin-top: 5px;">
        <tr>
            <td style="width: 75%; vertical-align: top;">
                <table class="bordered-box no-border-table">
                    <tr><td class="section-title" colspan="3">1. T2MIS Auto Generated</td></tr>
                    <tr>
                        <td style="width: 50%; padding: 5px 0 0 15px;">
                            1.1. Unique Learner Identifier (ULI) Number:
                            <div class="value" style="text-align: left; padding-left: 5px;">{{ $learner->learner_id }}</div>
                        </td>
                        <td style="width: 50%; padding: 5px 0 0 15px;">
                            1.2. Entry Date:
                            <div class="value" style="text-align: left; padding-left: 5px;">{{ \Carbon\Carbon::parse($learner->entry_date)->format('m/d/Y') }}</div>
                        </td>
                    </tr>
                    <tr><td class="section-title" colspan="3" style="margin-top: 5px;">2. Learner/Manpower Profile</td></tr>
                    <tr>
                        <td colspan="3" style="padding: 5px 15px 0 15px;">
                            2.1. Name:
                            <table class="no-border-table">
                                <tr>
                                    <td style="width: 50%;"><div class="value">{{ $learner->last_name }}, {{ $learner->extension_name }}</div><div class="label">Last Name, Extension Name (Jr., Sr.)</div></td>
                                    <td style="width: 25%;"><div class="value">{{ $learner->first_name }}</div><div class="label">First</div></td>
                                    <td style="width: 25%;"><div class="value">{{ $learner->middle_name }}</div><div class="label">Middle</div></td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                         <td colspan="3" style="padding: 5px 15px 0 15px;">
                             2.2. Complete Permanent Mailing Address:
                             <table class="no-border-table">
                                 <tr>
                                     <td style="width: 45%;"><div class="value">{{ $learner->address->number_street ?? '' }}</div><div class="label">Number, Street</div></td>
                                     <td style="width: 25%;"><div class="value">{{ $learner->address->barangay ?? '' }}</div><div class="label">Barangay</div></td>
                                     <td style="width: 30%;"><div class="value">{{ $learner->address->district ?? '' }}</div><div class="label">District</div></td>
                                 </tr>
                                 <tr>
                                     <td><div class="value">{{ $learner->address->city_municipality ?? '' }}</div><div class="label">City/Municipality</div></td>
                                     <td><div class="value">{{ $learner->address->province ?? '' }}</div><div class="label">Province</div></td>
                                     <td><div class="value">{{ $learner->address->region ?? '' }}</div><div class="label">Region</div></td>
                                 </tr>
                             </table>
                         </td>
                    </tr>
                     <tr>
                        <td colspan="3" style="padding: 5px 15px 5px 15px;">
                            <table class="no-border-table">
                                <tr>
                                    <td style="width: 50%;">Email Address/Facebook Account:<div class="value" style="text-align:left;">{{ $learner->user->email ?? 'N/A' }}</div></td>
                                    <td style="width: 25%;">Contact No:<div class="value">{{ $learner->address->contact_no ?? 'N/A' }}</div></td>
                                    <td style="width: 25%;">Nationality:<div class="value">{{ $learner->nationality ?? 'N/A' }}</div></td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </td>
            <td style="width: 25%; text-align: center; vertical-align: top;">
                <div class="image-box">
                    @if(!empty($learner->registrationSignature->picture_image_path_full))
                        <img src="{{ $learner->registrationSignature->picture_image_path_full }}" alt="ID Picture">
                    @else
                        <div style="padding-top: 40px; font-size: 8pt;">I.D. Picture</div>
                    @endif
                </div>
            </td>
        </tr>
    </table>

    <div class="section-title" style="margin-top: 5px;">3. Personal Information</div>
    <div class="bordered-box">
        <table class="no-border-table">
            <tr>
                <td style="width: 50%; border-right: 1.5px solid #000; padding: 5px;">
                    <table class="no-border-table">
                        <tr>
                            <td style="width: 40%;">
                                <strong>3.1. Sex</strong>
                                <div class="check-item"><span class="checkbox">@if($learner->gender == 'Male') X @endif</span> Male</div>
                                <div class="check-item"><span class="checkbox">@if($learner->gender == 'Female') X @endif</span> Female</div>
                            </td>
                            <td style="width: 60%;">
                                <strong>3.2. Civil Status</strong>
                                <div class="check-item"><span class="checkbox">@if($learner->civil_status == 'Single') X @endif</span> Single</div>
                                <div class="check-item"><span class="checkbox">@if($learner->civil_status == 'Married') X @endif</span> Married</div>
                                <div class="check-item"><span class="checkbox">@if($learner->civil_status == 'Widow/er') X @endif</span> Widow/er</div>
                                <div class="check-item"><span class="checkbox">@if(in_array($learner->civil_status, ['Separated', 'Divorced', 'Annulled'])) X @endif</span> Separated/Divorced/Annulled</div>
                                <div class="check-item"><span class="checkbox">@if(in_array($learner->civil_status, ['Common Law/ Live-in'])) X @endif</span> Common Law/ Live-in</div>
                            </td>
                        </tr>
                    </table>
                </td>
                <td style="width: 50%; padding: 5px;">
                    <strong>3.3 Employment (before the training)</strong>
                    <table class="no-border-table">
                        <tr>
                            <td style="width: 50%; vertical-align: top;"><em>Employment Status</em>
                                <div class="check-item"><span class="checkbox">@if($learner->employment_status == 'Wage-Employed') X @endif</span> Wage-Employed</div>
                                <div class="check-item"><span class="checkbox">@if($learner->employment_status == 'Self-Employed') X @endif</span> Self-Employed</div>
                                <div class="check-item"><span class="checkbox">@if($learner->employment_status == 'Unemployed') X @endif</span> Unemployed</div>
                            </td>
                            <td style="width: 50%; vertical-align: top;"><em>Employment Type</em>
                                <div class="check-item"><span class="checkbox">@if($learner->employment_type == 'Regular') X @endif</span> Regular</div>
                                <div class="check-item"><span class="checkbox">@if($learner->employment_type == 'Contractual') X @endif</span> Contractual</div>
                                <div class="check-item"><span class="checkbox">@if($learner->employment_type == 'Job Order') X @endif</span> Job Order</div>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
            <tr><td colspan="2" style="border-top: 1.5px solid #000; padding: 0;"></td></tr>
            <tr>
                <td colspan="2" style="padding: 5px;">
                     <table class="no-border-table">
                        <tr>
                            <td style="width: 50%; border-right: 1.5px solid #000; padding-right: 5px;">
                                <strong>3.4 Birthdate</strong>
                                <table class="no-border-table">
                                    <tr>
                                        <td style="width: 35%;"><div class="value">{{ \Carbon\Carbon::parse($learner->birth_date)->format('F') }}</div><div class="label">Month</div></td>
                                        <td style="width: 15%;"><div class="value">{{ \Carbon\Carbon::parse($learner->birth_date)->format('d') }}</div><div class="label">Day</div></td>
                                        <td style="width: 25%;"><div class="value">{{ \Carbon\Carbon::parse($learner->birth_date)->format('Y') }}</div><div class="label">Year</div></td>
                                        <td style="width: 25%;"><div class="value">{{ $learner->age }}</div><div class="label">Age</div></td>
                                    </tr>
                                </table>
                            </td>
                            <td style="width: 50%; padding-left: 5px;">
                                <strong>3.5 Birthplace</strong>
                                <table class="no-border-table">
                                    <tr>
                                        <td><div class="value">{{ $learner->birthplace_city_municipality ?? '' }}</div><div class="label">City/Municipality</div></td>
                                        <td><div class="value">{{ $learner->birthplace_province ?? '' }}</div><div class="label">Province</div></td>
                                        <td><div class="value">{{ $learner->birthplace_region ?? '' }}</div><div class="label">Region</div></td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                     </table>
                </td>
            </tr>
             <tr><td colspan="2" style="border-top: 1.5px solid #000; padding: 0;"></td></tr>
             <tr>
                 <td colspan="2" style="padding: 5px;">
                    @php $edu = $learner->educationalAttainment; @endphp
                    <strong>3.6 Educational Attainment Before the Training (Trainee)</strong>
                    <table class="no-border-table">
                        <tr>
                            <td style="width: 33.3%;">
                                <div class="check-item"><span class="checkbox">@if($edu->no_grade_completed) X @endif</span> No Grade Completed</div>
                                <div class="check-item"><span class="checkbox">@if($edu->elementary_undergraduate) X @endif</span> Elementary Undergraduate</div>
                                <div class="check-item"><span class="checkbox">@if($edu->elementary_graduate) X @endif</span> Elementary Graduate</div>
                                <div class="check-item"><span class="checkbox">@if($edu->high_school_undergraduate) X @endif</span> High School Undergraduate</div>
                                <div class="check-item"><span class="checkbox">@if($edu->high_school_graduate) X @endif</span> High School Graduate</div>
                            </td>
                            <td style="width: 33.3%;">
                                <div class="check-item"><span class="checkbox">@if($edu->junior_high_k12) X @endif</span> Junior High (K-12)</div>
                                <div class="check-item"><span class="checkbox">@if($edu->senior_high_k12) X @endif</span> Senior High (K-12)</div>
                                <div class="check-item"><span class="checkbox">@if($edu->post_secondary_non_tertiary_technical_vocational_undergraduate) X @endif</span> Post-Secondary Non-Tertiary/ Undergrad</div>
                                <div class="check-item"><span class="checkbox">@if($edu->post_secondary_non_tertiary_technical_vocational_course_graduate) X @endif</span> Post-Secondary Non-Tertiary/ Graduate</div>
                            </td>
                            <td style="width: 33.3%;">
                                <div class="check-item"><span class="checkbox">@if($edu->college_undergraduate) X @endif</span> College Undergraduate</div>
                                <div class="check-item"><span class="checkbox">@if($edu->college_graduate) X @endif</span> College Graduate</div>
                                <div class="check-item"><span class="checkbox">@if($edu->masteral) X @endif</span> Masteral</div>
                                <div class="check-item"><span class="checkbox">@if($edu->doctorate) X @endif</span> Doctorate</div>
                            </td>
                        </tr>
                    </table>
                 </td>
             </tr>
              <tr><td colspan="2" style="border-top: 1.5px solid #000; padding: 0;"></td></tr>
              <tr>
                  <td colspan="2" style="padding: 5px;">
                      <strong>3.7 Parent/Guardian</strong>
                      <table class="no-border-table">
                         <tr>
                             <td style="width: 50%;"><div class="value">{{ $learner->parent_guardian_name ?? 'N/A' }}</div><div class="label">Name</div></td>
                             <td style="width: 50%;"><div class="value">{{ $learner->parent_guardian_mailing_address ?? 'N/A' }}</div><div class="label">Complete Permanent Mailing Address</div></td>
                         </tr>
                      </table>
                  </td>
              </tr>
        </table>
    </div>

    <div class="page-break"></div>

    @php
        $classifications = $learner->classifications->pluck('type')->all();
        $hasClassification = fn($type) => in_array($type, $classifications) ? 'X' : '';
    @endphp
    
    <div class="section-title" style="margin-top: 5px;">4. Learner/Trainee/Student (Clients) Classification (if any, please check (?) appropriate box/es)</div>
     <div class="bordered-box" style="font-size:8pt;">
         <table class="no-border-table">
             <tr>
                 <td style="width: 33.3%;">
                    <div class="check-item"><span class="checkbox">{{ $hasClassification('4Ps Beneficiary') }}</span> 4Ps Beneficiary</div>
                    <div class="check-item"><span class="checkbox">{{ $hasClassification('Displaced Workers') }}</span> Displaced Workers</div>
                    <div class="check-item"><span class="checkbox">{{ $hasClassification('Family Members of AFP and PNP Wounded-in-Action') }}</span> Family Members of AFP and PNP Wounded-in-Action</div>
                    <div class="check-item"><span class="checkbox">{{ $hasClassification('Industry Workers') }}</span> Industry Workers</div>
                    <div class="check-item"><span class="checkbox">{{ $hasClassification('Out-of-School-Youth') }}</span> Out-of-School-Youth</div>
                    <div class="check-item"><span class="checkbox">{{ $hasClassification('Rebel Returnees/Decommissioned Combatants') }}</span> Rebel Returnees/Decommissioned Combatants</div>
                    <div class="check-item"><span class="checkbox">{{ $hasClassification('TESDA Alumni') }}</span> TESDA Alumni</div>
                    <div class="check-item"><span class="checkbox">{{ $hasClassification('Victim of Natural Disasters and Calamities') }}</span> Victim of Natural Disasters and Calamities</div>
                 </td>
                  <td style="width: 33.3%;">
                    <div class="check-item"><span class="checkbox">{{ $hasClassification('Agrarian Reform Beneficiary') }}</span> Agrarian Reform Beneficiary</div>
                    <div class="check-item"><span class="checkbox">{{ $hasClassification('Drug Dependents Surrenderees') }}</span> Drug Dependents Surrenderees</div>
                    <div class="check-item"><span class="checkbox">{{ $hasClassification('Farmers and Fishermen') }}</span> Farmers and Fishermen</div>
                    <div class="check-item"><span class="checkbox">{{ $hasClassification('Inmates and Detainees') }}</span> Inmates and Detainees</div>
                    <div class="check-item"><span class="checkbox">{{ $hasClassification('Overseas Filipino Workers (OFW) Dependent') }}</span> Overseas Filipino Workers (OFW) Dependent</div>
                    <div class="check-item"><span class="checkbox">{{ $hasClassification('Returning/Repatriated Overseas Filipino Workers (OFW)') }}</span> Returning/Repatriated Overseas Filipino Workers (OFW)</div>
                    <div class="check-item"><span class="checkbox">{{ $hasClassification('TVET Trainers') }}</span> TVET Trainers</div>
                    <div class="check-item"><span class="checkbox">{{ $hasClassification('Wounded-in-Action AFP & PNP Personnel') }}</span> Wounded-in-Action AFP & PNP Personnel</div>
                 </td>
                 <td style="width: 33.3%;">
                    <div class="check-item"><span class="checkbox">{{ $hasClassification('Balik Probinsya') }}</span> Balik Probinsya</div>
                    <div class="check-item"><span class="checkbox">{{ $hasClassification('Family Members of AFP and PNP Killed-in-Action') }}</span> Family Members of AFP and PNP Killed-in-Action</div>
                    <div class="check-item"><span class="checkbox">{{ $hasClassification('Indigenous People & Cultural Communities') }}</span> Indigenous People & Cultural Communities</div>
                    <div class="check-item"><span class="checkbox">{{ $hasClassification('MILF Beneficiary') }}</span> MILF Beneficiary</div>
                    <div class="check-item"><span class="checkbox">{{ $hasClassification('RCEF-RESP') }}</span> RCEF-RESP</div>
                    <div class="check-item"><span class="checkbox">{{ $hasClassification('Student') }}</span> Student</div>
                    <div class="check-item"><span class="checkbox">{{ $hasClassification('Uniformed Personnel') }}</span> Uniformed Personnel</div>
                 </td>
             </tr>
         </table>
     </div>

     @php
        $disabilities = $learner->disabilities->pluck('disabilityType.name')->all();
        $hasDisability = fn($type) => in_array($type, $disabilities) ? 'X' : '';
     @endphp
     <div class="section-title" style="margin-top: 5px;">5. Type of Disability (for Persons with Disability Only): <span style="font-weight:normal; font-style:italic;">To be filled up by the TESDA personnel</span></div>
     <div class="bordered-box" style="font-size:8pt;">
         <table class="no-border-table">
             <tr>
                 <td style="width: 33.3%;"><div class="check-item"><span class="checkbox">{{ $hasDisability('Mental/Intellectual') }}</span> Mental/Intellectual</div></td>
                 <td style="width: 33.3%;"><div class="check-item"><span class="checkbox">{{ $hasDisability('Visual Disability') }}</span> Visual Disability</div></td>
                 <td style="width: 33.3%;"><div class="check-item"><span class="checkbox">{{ $hasDisability('Orthopedic (Musculoskeletal) Disability') }}</span> Orthopedic (Musculoskeletal) Disability</div></td>
             </tr>
             <tr>
                 <td><div class="check-item"><span class="checkbox">{{ $hasDisability('Hearing Disability') }}</span> Hearing Disability</div></td>
                 <td><div class="check-item"><span class="checkbox">{{ $hasDisability('Speech Impairment') }}</span> Speech Impairment</div></td>
                 <td><div class="check-item"><span class="checkbox">{{ $hasDisability('Multiple Disabilities') }}</span> Multiple Disabilities, specify ____________</div></td>
             </tr>
             <tr>
                 <td><div class="check-item"><span class="checkbox">{{ $hasDisability('Psychosocial Disability') }}</span> Psychosocial Disability</div></td>
                 <td><div class="check-item"><span class="checkbox">{{ $hasDisability('Disability Due to Chronic Illness') }}</span> Disability Due to Chronic Illness</div></td>
                 <td><div class="check-item"><span class="checkbox">{{ $hasDisability('Learning Disability') }}</span> Learning Disability</div></td>
             </tr>
         </table>
     </div>

    <div class="section-title" style="margin-top: 5px;">6. Causes of Disability (for Persons with Disability Only): <span style="font-weight:normal; font-style:italic;">To be filled up by the TESDA personnel</span></div>
    <div class="bordered-box" style="font-size:8pt;">
         <table class="no-border-table">
             <tr>
                 <td style="width: 33.3%;"><div class="check-item"><span class="checkbox">{{ $learner->disabilities->first()?->cause_of_disability == 'Congenital/Inborn' ? 'X' : '' }}</span> Congenital/Inborn</div></td>
                 <td style="width: 33.3%;"><div class="check-item"><span class="checkbox">{{ $learner->disabilities->first()?->cause_of_disability == 'Illness' ? 'X' : '' }}</span> Illness</div></td>
                 <td style="width: 33.3%;"><div class="check-item"><span class="checkbox">{{ $learner->disabilities->first()?->cause_of_disability == 'Injury' ? 'X' : '' }}</span> Injury</div></td>
             </tr>
         </table>
    </div>

    <table class="no-border-table" style="margin-top: 5px;">
         <tr>
             <td>
                 <div class="section-title">7. Name of Course/Qualification:</div>
                 <div class="bordered-box" style="padding: 4px; text-align:left; font-weight: bold;">
                     {{ $learner->courseEnrollments->first()->program->course_name ?? 'N/A' }}
                 </div>
             </td>
         </tr>
         <tr>
            <td>
                <div class="section-title" style="margin-top: 5px;">8. If Scholar, What Type of Scholarship Package (TWSP, PESFA, STEP, others)?</div>
                <div class="bordered-box" style="padding: 4px; text-align:left; font-weight: bold;">
                    {{ $learner->courseEnrollments->first()->scholarship_package ?? 'Not Applicable' }}
                </div>
            </td>
        </tr>
    </table>
    
    <div class="section-title" style="margin-top: 5px;">9. Privacy Consent and Disclaimer</div>
    <div class="bordered-box" style="font-size: 8pt; text-align: justify; padding: 4px;">
        I hereby attest that I have read and understood the Privacy Notice of TESDA through its website (https://www.tesda.gov.ph) and thereby giving my consent in the processing of my personal information indicated in this Learners Profile. The processing includes scholarships, employment, survey, and all other related TESDA programs that may be beneficial to my qualifications.
        <br>
        <table class="no-border-table">
            <tr>
                <td style="width: 50%; padding-top: 5px;"><span class="checkbox">@if($learner->privacyConsent?->consent_given) X @endif</span> Agree</td>
                <td style="width: 50%; padding-top: 5px;"><span class="checkbox">@if(!$learner->privacyConsent?->consent_given) X @endif</span> Disagree</td>
            </tr>
        </table>
    </div>
    
    <div class="section-title" style="margin-top: 5px;">10. Applicant's Signature</div>
    <div class="bordered-box">
        <div style="font-size: 8pt; text-align:center; padding: 4px;">This is to certify that the information stated above is true and correct.</div>
        <table class="no-border-table">
            <tr>
                <td style="width: 65%; vertical-align: bottom; text-align: center; padding-top: 35px;">
                    <div class="value" style="width: 250px; margin: 0 auto;">{{ $learner->registrationSignature->applicant_signature_printed_name ?? '' }}</div>
                    <div class="label" style="font-weight: bold;">APPLICANT'S SIGNATURE OVER PRINTED NAME</div>
                </td>
                <td style="width: 35%; text-align: center;">
                    <div style="font-size: 7pt; text-align: center; font-style:italic;">1x1 picture taken within the last 6 months</div>
                    <div class="thumb-box" style="height: 60px; width: 60px; margin-top: 2px;">
                        @if(!empty($learner->registrationSignature->thumbmark_image_path_full))
                            <img src="{{ $learner->registrationSignature->thumbmark_image_path_full }}" alt="Thumbmark">
                        @endif
                    </div>
                    <div class="label" style="font-weight: bold;">Right Thumbmark</div>
                </td>
            </tr>
            <tr>
                <td style="text-align: center; vertical-align: bottom; padding-top: 10px;">
                    <div class="value" style="width: 150px; margin: 0 auto;">
                        @if($learner->registrationSignature?->date_accomplished)
                            {{ \Carbon\Carbon::parse($learner->registrationSignature->date_accomplished)->format('m/d/Y') }}
                        @endif
                    </div>
                    <div class="label" style="font-weight: bold;">DATE ACCOMPLISHED</div>
                </td>
                <td></td>
            </tr>
            <tr><td colspan="2" style="border-top: 1.5px solid #000; padding: 5px 0;"></td></tr>
            <tr>
                <td style="text-align: center; vertical-align: bottom; padding-top: 25px;">
                    <div class="value" style="width: 250px; margin: 0 auto;"> </div>
                    <div class="label" style="font-weight: bold;">REGISTRAR/SCHOOL ADMINISTRATOR</div>
                    <div class="label" style="font-weight: bold;">(Signature Over Printed Name)</div>
                </td>
                <td style="text-align: center; vertical-align: bottom; padding-top: 25px;">
                    <div class="value" style="width: 150px; margin: 0 auto;"> </div>
                    <div class="label" style="font-weight: bold;">DATE RECEIVED</div>
                </td>
            </tr>
        </table>
    </div>

</body>
</html>