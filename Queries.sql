// 12 month

select id,sfid,name, consultation_date__c,record_type__c,mch_child_asdetect__r__externalchildid__c, mch_child_asdetect__c ,at_risk__c,pointing__c, does_child_make_eye_contact_with_you__c, 
waves_bye_bye__c, imitation__c, responds_to_name__c, social_smile__c, conversational_babble__c,
says_1_3_clear_words__c, understands_obeys_simple_instructions__c, attending_to_sounds__c 
from salesforce.consultation_asdetect__c;

select m.id,c.id,c.externalatrisk__c,c.sfid,c.name, c.consultation_date__c,c.record_type__c,c.mch_child_asdetect__r__externalchildid__c, c.mch_child_asdetect__c ,c.at_risk__c,c.age_at_time_of_assessment_years_months__c
from salesforce.consultation_asdetect__c c,salesforce.mch_child_asdetect__c m where
c.mch_child_asdetect__r__externalchildid__c=m.externalchildid__c and m.asdetect_contact__c__loyaltyid__c!= '';



insert into salesforce.consultation_asdetect__c (recordtypeid,consultation_date__c,mch_child_asdetect__r__externalchildid__c ,pointing__c, does_child_make_eye_contact_with_you__c, 
waves_bye_bye__c, imitation__c, responds_to_name__c, social_smile__c, conversational_babble__c,
says_1_3_clear_words__c, understands_obeys_simple_instructions__c, attending_to_sounds__c) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)'



\d salesforce.consultation_asdetect__c;
\d salesforce.mch_child_asdetect__c;
\d salesforce.asdetect_contact__c;
\dt salesforce.*;
\d tokens;

// tokens ans users
select t.token,t.created,c.email__c from tokens t,salesforce.asdetect_contact__c c where t.externaluserid=c.loyaltyid__c;





 sfid                                      | character varying(18)       | 
 _hc_err                                   | text                        | 
 name                                      | character varying(80)       | 
 systemmodstamp                            | timestamp without time zone | 
 _hc_lastop                                | character varying(32)       | 
 at_risk__c                                | character varying(1300)     | 
 id                                        | integer                     | not null default nextval('salesforce.consultation_asdetect__c_id_seq'::regclass)
 isdeleted                                 | boolean                     | 
 pretend_play__c                           | character varying(255)      | 
 follows_point__c                          | character varying(255)      | 
 recordtypeid                              | character varying(18)       | 
 does_the_child_use_various_syllables__c   | character varying(255)      | 
 interest_in_other_children__c             | character varying(255)      | 
 showing__c                                | character varying(255)      | 
 imitation__c                              | character varying(255)      | 
 consultation_date__c                      | date                        | 
 immediate_echolalia__c                    | character varying(255)      | 
 language_delay__c                         | boolean                     | 
 two_word_utterances__c                    | character varying(255)      | 
 attending_to_sounds__c                    | character varying(255)      | 
 waves_bye_bye__c                          | character varying(255)      | 
 rep_rest_behaviours_and_interests__c      | character varying(255)      | 
 points_to_facial_features__c              | character varying(255)      | 
 says_1_3_clear_words__c                   | character varying(255)      | 
 mch_child_asdetect__c                     | character varying(18)       | 
 repetitive_speech__c                      | character varying(255)      | 
 gestures__c                               | character varying(255)      | 
 does_child_make_eye_contact_with_you__c   | character varying(255)      | 
 motor_stereotypes__c                      | character varying(255)      | 
 responds_to_name__c                       | character varying(255)      | 
 conversational_babble__c                  | character varying(255)      | 
 uses_5_10_words__c                        | character varying(255)      | 
 understands_words__c                      | character varying(255)      | 
 follows_two_unrelated_commands__c         | character varying(255)      | 
 hand_as_a_tool__c                         | character varying(255)      | 
 social_smile__c                           | character varying(255)      | 
 mch_child_asdetect__r__externalchildid__c | character varying(20)       | 
 odd_or_unusual_speech__c                  | character varying(255)      | 
 reciprocal_social_interaction__c          | character varying(255)      | 
 did_child_recieve_a_diagnosis__c          | character varying(255)      | 
 sensory_behaviours_and_interests__c       | character varying(255)      | 
 conversation__c                           | character varying(255)      | 
 understands_obeys_simple_instructions__c  | character varying(255)      | 
 loss_of_skills__c                         | character varying(255)      | 
 uses_5_6_word_sentences__c                | character varying(255)      | 
 joint_attention__c                        | character varying(255)      | 
 parallel_play__c                          | character varying(255)      | 
 uses_20_50_words__c                       | character varying(255)      | 
 communicates_with_parents_socially__c     | character varying(255)      | 
 comes_over_to_parent_for_affection__c     | character varying(255)      | 
 pointing__c                               | character varying(255)      | 
 pronoun_reversals__c                      | character varying(255)      | 
 record_type__c                            | character varying(1300)     | 
 sharing_interest__c                       | character varying(255)      | 