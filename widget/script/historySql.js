var historySql = {
    createCaseHistory: "create table if not exists caseHistory(\
			                id text, \
			                record_date text, \
			                consultation_department text, \
			                chief_complaint text, \
			                accessory_exam_id text, \
			                diagnosis text, \
			                treatment text, \
			                record_doctor text, \
			                follow_up text, \
			                patient_pointer text, \
			                physical_pointer text\
			            );",
    createPatient: "create table if not exists patient(\
    					id text, \
    					name text, \
    					gender text, \
    					birthday text, \
    					age text, \
                        admission_number text, \
    					outpatient_number text, \
    					phone text, \
    					address text, \
    					job text, \
    					record_doctor\
    				);",
    createPhysical: "create table if not exists physical(\
    					id text, \
    					vod text, \
    					vos text, \
    					corrected_vod text, \
    					corrected_vos text, \
    					tod text, \
    					tos text, \
    					outer_eye text, \
    					conjunctiva text, \
    					cornea text, \
    					anterior_chamber text, \
    					lens text, \
    					vitreous text, \
    					eyeground text\
    				);"
}
