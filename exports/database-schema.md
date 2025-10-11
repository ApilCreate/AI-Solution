# Database Schema Export

Export Date: 2025-10-11T11:50:10.365Z

---

## Table: activity_logs

### Columns

| Column Name | Data Type | Nullable | Default |
|-------------|-----------|----------|---------|
| id | uuid | No | - |
| admin_id | uuid | No | - |
| action | character varying(255) | No | - |
| description | text | No | - |
| target_type | character varying(100) | Yes | - |
| target_id | uuid | Yes | - |
| metadata | jsonb | Yes | '{}'::jsonb |
| ip_address | character varying(45) | Yes | - |
| user_agent | text | Yes | - |
| created_at | timestamp with time zone | No | now() |

### Constraints

| Constraint Name | Type | Column | References |
|-----------------|------|--------|------------|
| 2200_57344_2_not_null | CHECK | - | - |
| 2200_57344_4_not_null | CHECK | - | - |
| 2200_57344_10_not_null | CHECK | - | - |
| 2200_57344_1_not_null | CHECK | - | - |
| 2200_57344_3_not_null | CHECK | - | - |
| activity_logs_admin_id_fkey | FOREIGN KEY | admin_id | admin_users.id |
| activity_logs_pkey | PRIMARY KEY | id | activity_logs.id |

---

## Table: admin_users

### Columns

| Column Name | Data Type | Nullable | Default |
|-------------|-----------|----------|---------|
| id | uuid | No | - |
| email | character varying(255) | No | - |
| password_hash | character varying(255) | No | - |
| role | character varying(50) | No | 'admin'::character varying |
| created_at | timestamp with time zone | No | now() |

### Constraints

| Constraint Name | Type | Column | References |
|-----------------|------|--------|------------|
| 2200_16482_2_not_null | CHECK | - | - |
| 2200_16482_4_not_null | CHECK | - | - |
| 2200_16482_5_not_null | CHECK | - | - |
| 2200_16482_1_not_null | CHECK | - | - |
| 2200_16482_3_not_null | CHECK | - | - |
| admin_users_pkey | PRIMARY KEY | id | admin_users.id |
| admin_users_email_unique | UNIQUE | email | admin_users.email |

---

## Table: backup_data

### Columns

| Column Name | Data Type | Nullable | Default |
|-------------|-----------|----------|---------|
| id | uuid | No | gen_random_uuid() |
| backup_id | uuid | No | - |
| table_name | character varying(100) | No | - |
| record_id | character varying(255) | No | - |
| operation | character varying(20) | No | - |
| data | jsonb | No | - |
| original_created_at | timestamp with time zone | Yes | - |
| original_updated_at | timestamp with time zone | Yes | - |
| backed_up_at | timestamp with time zone | No | now() |
| is_deleted | boolean | No | false |

### Constraints

| Constraint Name | Type | Column | References |
|-----------------|------|--------|------------|
| 2200_106509_10_not_null | CHECK | - | - |
| 2200_106509_6_not_null | CHECK | - | - |
| 2200_106509_9_not_null | CHECK | - | - |
| 2200_106509_1_not_null | CHECK | - | - |
| 2200_106509_2_not_null | CHECK | - | - |
| 2200_106509_3_not_null | CHECK | - | - |
| 2200_106509_4_not_null | CHECK | - | - |
| 2200_106509_5_not_null | CHECK | - | - |
| backup_data_backup_id_backup_metadata_id_fk | FOREIGN KEY | backup_id | backup_metadata.id |
| backup_data_pkey | PRIMARY KEY | id | backup_data.id |

---

## Table: backup_metadata

### Columns

| Column Name | Data Type | Nullable | Default |
|-------------|-----------|----------|---------|
| id | uuid | No | gen_random_uuid() |
| name | character varying(255) | No | - |
| description | text | Yes | - |
| backup_type | character varying(50) | No | - |
| status | character varying(20) | No | 'in_progress'::character varying |
| tables_included | jsonb | No | - |
| record_count | integer | No | 0 |
| file_size | integer | No | 0 |
| file_path | character varying(500) | Yes | - |
| date_from | timestamp with time zone | Yes | - |
| date_to | timestamp with time zone | Yes | - |
| created_at | timestamp with time zone | No | now() |
| expires_at | timestamp with time zone | No | - |
| created_by | uuid | No | - |
| recovery_point | boolean | No | false |

### Constraints

| Constraint Name | Type | Column | References |
|-----------------|------|--------|------------|
| 2200_106496_15_not_null | CHECK | - | - |
| 2200_106496_13_not_null | CHECK | - | - |
| 2200_106496_14_not_null | CHECK | - | - |
| 2200_106496_1_not_null | CHECK | - | - |
| 2200_106496_2_not_null | CHECK | - | - |
| 2200_106496_4_not_null | CHECK | - | - |
| 2200_106496_5_not_null | CHECK | - | - |
| 2200_106496_6_not_null | CHECK | - | - |
| 2200_106496_7_not_null | CHECK | - | - |
| 2200_106496_8_not_null | CHECK | - | - |
| 2200_106496_12_not_null | CHECK | - | - |
| backup_metadata_created_by_admin_users_id_fk | FOREIGN KEY | created_by | admin_users.id |
| backup_metadata_pkey | PRIMARY KEY | id | backup_metadata.id |

---

## Table: blogs

### Columns

| Column Name | Data Type | Nullable | Default |
|-------------|-----------|----------|---------|
| id | uuid | No | gen_random_uuid() |
| title | character varying(255) | No | - |
| content | text | No | - |
| excerpt | text | Yes | - |
| author | character varying(255) | No | - |
| image | character varying(500) | Yes | - |
| category | character varying(100) | Yes | - |
| tags | jsonb | Yes | '[]'::jsonb |
| read_time | character varying(50) | Yes | - |
| status | character varying(20) | No | 'draft'::character varying |
| published_at | timestamp with time zone | Yes | - |
| created_at | timestamp with time zone | No | now() |
| updated_at | timestamp with time zone | No | now() |

### Constraints

| Constraint Name | Type | Column | References |
|-----------------|------|--------|------------|
| 2200_32768_13_not_null | CHECK | - | - |
| 2200_32768_1_not_null | CHECK | - | - |
| 2200_32768_2_not_null | CHECK | - | - |
| 2200_32768_3_not_null | CHECK | - | - |
| 2200_32768_5_not_null | CHECK | - | - |
| 2200_32768_10_not_null | CHECK | - | - |
| 2200_32768_12_not_null | CHECK | - | - |
| blogs_pkey | PRIMARY KEY | id | blogs.id |

---

## Table: deleted_records

### Columns

| Column Name | Data Type | Nullable | Default |
|-------------|-----------|----------|---------|
| id | uuid | No | gen_random_uuid() |
| table_name | character varying(100) | No | - |
| record_id | character varying(255) | No | - |
| deleted_data | jsonb | No | - |
| deleted_at | timestamp with time zone | No | now() |
| deleted_by | uuid | Yes | - |
| reason | character varying(255) | Yes | - |
| original_created_at | timestamp with time zone | Yes | - |
| original_updated_at | timestamp with time zone | Yes | - |
| recovered | boolean | No | false |

### Constraints

| Constraint Name | Type | Column | References |
|-----------------|------|--------|------------|
| 2200_106519_10_not_null | CHECK | - | - |
| 2200_106519_4_not_null | CHECK | - | - |
| 2200_106519_5_not_null | CHECK | - | - |
| 2200_106519_1_not_null | CHECK | - | - |
| 2200_106519_2_not_null | CHECK | - | - |
| 2200_106519_3_not_null | CHECK | - | - |
| deleted_records_deleted_by_admin_users_id_fk | FOREIGN KEY | deleted_by | admin_users.id |
| deleted_records_pkey | PRIMARY KEY | id | deleted_records.id |

---

## Table: demo_bookings

### Columns

| Column Name | Data Type | Nullable | Default |
|-------------|-----------|----------|---------|
| id | uuid | No | gen_random_uuid() |
| name | character varying(255) | No | - |
| email | character varying(255) | No | - |
| company | character varying(255) | No | - |
| solution_id | uuid | No | - |
| solution_name | character varying(255) | No | - |
| message | text | Yes | - |
| preferred_date | character varying(50) | Yes | - |
| preferred_time | character varying(50) | Yes | - |
| status | character varying(50) | No | 'pending'::character varying |
| admin_notes | text | Yes | - |
| admin_reply | text | Yes | - |
| replied_at | timestamp with time zone | Yes | - |
| scheduled_at | timestamp with time zone | Yes | - |
| created_at | timestamp with time zone | No | now() |
| updated_at | timestamp with time zone | No | now() |

### Constraints

| Constraint Name | Type | Column | References |
|-----------------|------|--------|------------|
| 2200_90112_16_not_null | CHECK | - | - |
| 2200_90112_10_not_null | CHECK | - | - |
| 2200_90112_15_not_null | CHECK | - | - |
| 2200_90112_1_not_null | CHECK | - | - |
| 2200_90112_2_not_null | CHECK | - | - |
| 2200_90112_3_not_null | CHECK | - | - |
| 2200_90112_4_not_null | CHECK | - | - |
| 2200_90112_5_not_null | CHECK | - | - |
| 2200_90112_6_not_null | CHECK | - | - |
| demo_bookings_solution_id_fkey | FOREIGN KEY | solution_id | solutions.id |
| demo_bookings_pkey | PRIMARY KEY | id | demo_bookings.id |

---

## Table: event_rsvps

### Columns

| Column Name | Data Type | Nullable | Default |
|-------------|-----------|----------|---------|
| id | uuid | No | - |
| event_id | uuid | No | - |
| name | character varying(255) | No | - |
| email | character varying(255) | No | - |
| company | character varying(255) | Yes | - |
| attendees | integer | No | 1 |
| created_at | timestamp with time zone | No | now() |

### Constraints

| Constraint Name | Type | Column | References |
|-----------------|------|--------|------------|
| 2200_16493_7_not_null | CHECK | - | - |
| 2200_16493_4_not_null | CHECK | - | - |
| 2200_16493_6_not_null | CHECK | - | - |
| 2200_16493_1_not_null | CHECK | - | - |
| 2200_16493_2_not_null | CHECK | - | - |
| 2200_16493_3_not_null | CHECK | - | - |
| event_rsvps_event_id_events_id_fk | FOREIGN KEY | event_id | events.id |
| event_rsvps_pkey | PRIMARY KEY | id | event_rsvps.id |

---

## Table: events

### Columns

| Column Name | Data Type | Nullable | Default |
|-------------|-----------|----------|---------|
| id | uuid | No | - |
| title | character varying(255) | No | - |
| date | date | No | - |
| location | character varying(255) | No | - |
| banner_url | character varying(500) | Yes | - |
| description | text | Yes | - |
| created_at | timestamp with time zone | No | now() |

### Constraints

| Constraint Name | Type | Column | References |
|-----------------|------|--------|------------|
| 2200_16502_1_not_null | CHECK | - | - |
| 2200_16502_2_not_null | CHECK | - | - |
| 2200_16502_3_not_null | CHECK | - | - |
| 2200_16502_4_not_null | CHECK | - | - |
| 2200_16502_7_not_null | CHECK | - | - |
| events_pkey | PRIMARY KEY | id | events.id |

---

## Table: inquiries

### Columns

| Column Name | Data Type | Nullable | Default |
|-------------|-----------|----------|---------|
| id | uuid | No | - |
| created_at | timestamp with time zone | No | now() |
| name | character varying(255) | No | - |
| email | character varying(255) | No | - |
| phone | character varying(50) | Yes | - |
| company | character varying(255) | Yes | - |
| country | character varying(100) | Yes | - |
| occupation | character varying(255) | Yes | - |
| reason | character varying(100) | No | - |
| how_did_you_hear | character varying(100) | Yes | - |
| message_title | character varying(255) | No | - |
| message | text | No | - |
| status | character varying(50) | No | 'new'::character varying |
| tags | jsonb | Yes | '[]'::jsonb |
| source | character varying(50) | No | 'web-form'::character varying |
| updated_at | timestamp with time zone | No | now() |
| admin_response | text | Yes | - |
| responded_at | timestamp with time zone | Yes | - |

### Constraints

| Constraint Name | Type | Column | References |
|-----------------|------|--------|------------|
| 2200_16510_16_not_null | CHECK | - | - |
| 2200_16510_1_not_null | CHECK | - | - |
| 2200_16510_2_not_null | CHECK | - | - |
| 2200_16510_3_not_null | CHECK | - | - |
| 2200_16510_4_not_null | CHECK | - | - |
| 2200_16510_9_not_null | CHECK | - | - |
| 2200_16510_11_not_null | CHECK | - | - |
| 2200_16510_12_not_null | CHECK | - | - |
| 2200_16510_13_not_null | CHECK | - | - |
| 2200_16510_15_not_null | CHECK | - | - |
| inquiries_pkey | PRIMARY KEY | id | inquiries.id |

---

## Table: ratings

### Columns

| Column Name | Data Type | Nullable | Default |
|-------------|-----------|----------|---------|
| id | uuid | No | gen_random_uuid() |
| name | character varying(255) | No | - |
| email | character varying(255) | No | - |
| rating | integer | No | - |
| comment | text | No | - |
| is_published | boolean | No | false |
| admin_reply | text | Yes | - |
| replied_at | timestamp with time zone | Yes | - |
| status | character varying(50) | No | 'new'::character varying |
| created_at | timestamp with time zone | No | now() |
| updated_at | timestamp with time zone | No | now() |

### Constraints

| Constraint Name | Type | Column | References |
|-----------------|------|--------|------------|
| 2200_73728_11_not_null | CHECK | - | - |
| ratings_status_check | CHECK | - | ratings.status |
| ratings_rating_check | CHECK | - | ratings.rating |
| 2200_73728_1_not_null | CHECK | - | - |
| 2200_73728_2_not_null | CHECK | - | - |
| 2200_73728_3_not_null | CHECK | - | - |
| 2200_73728_4_not_null | CHECK | - | - |
| 2200_73728_5_not_null | CHECK | - | - |
| 2200_73728_6_not_null | CHECK | - | - |
| 2200_73728_9_not_null | CHECK | - | - |
| 2200_73728_10_not_null | CHECK | - | - |
| ratings_pkey | PRIMARY KEY | id | ratings.id |

---

## Table: solutions

### Columns

| Column Name | Data Type | Nullable | Default |
|-------------|-----------|----------|---------|
| id | uuid | No | gen_random_uuid() |
| title | character varying(255) | No | - |
| description | text | No | - |
| short_description | text | Yes | - |
| category | character varying(100) | No | - |
| features | jsonb | Yes | '[]'::jsonb |
| benefits | jsonb | Yes | '[]'::jsonb |
| use_cases | jsonb | Yes | '[]'::jsonb |
| pricing | character varying(100) | Yes | - |
| image_url | character varying(500) | Yes | - |
| icon_name | character varying(100) | Yes | - |
| status | character varying(20) | No | 'draft'::character varying |
| featured | boolean | No | false |
| sort_order | integer | No | 0 |
| created_at | timestamp with time zone | No | now() |
| updated_at | timestamp with time zone | No | now() |

### Constraints

| Constraint Name | Type | Column | References |
|-----------------|------|--------|------------|
| 2200_81920_16_not_null | CHECK | - | - |
| 2200_81920_1_not_null | CHECK | - | - |
| 2200_81920_2_not_null | CHECK | - | - |
| 2200_81920_3_not_null | CHECK | - | - |
| 2200_81920_5_not_null | CHECK | - | - |
| 2200_81920_12_not_null | CHECK | - | - |
| 2200_81920_13_not_null | CHECK | - | - |
| 2200_81920_14_not_null | CHECK | - | - |
| 2200_81920_15_not_null | CHECK | - | - |
| solutions_pkey | PRIMARY KEY | id | solutions.id |

---

## Table: table_metadata

### Columns

| Column Name | Data Type | Nullable | Default |
|-------------|-----------|----------|---------|
| table_name | character varying(100) | No | - |
| first_record_date | timestamp with time zone | Yes | - |
| last_record_date | timestamp with time zone | Yes | - |
| total_records | integer | No | 0 |
| last_updated | timestamp with time zone | No | now() |

### Constraints

| Constraint Name | Type | Column | References |
|-----------------|------|--------|------------|
| 2200_106529_1_not_null | CHECK | - | - |
| 2200_106529_4_not_null | CHECK | - | - |
| 2200_106529_5_not_null | CHECK | - | - |
| table_metadata_pkey | PRIMARY KEY | table_name | table_metadata.table_name |

---

## Table: testimonials

### Columns

| Column Name | Data Type | Nullable | Default |
|-------------|-----------|----------|---------|
| id | uuid | No | gen_random_uuid() |
| rating_id | uuid | No | - |
| name | character varying(255) | No | - |
| role | character varying(255) | Yes | - |
| company | character varying(255) | Yes | - |
| testimonial | text | No | - |
| rating | integer | No | - |
| status | character varying(20) | No | 'published'::character varying |
| created_at | timestamp with time zone | No | now() |
| updated_at | timestamp with time zone | No | now() |

### Constraints

| Constraint Name | Type | Column | References |
|-----------------|------|--------|------------|
| 2200_73742_10_not_null | CHECK | - | - |
| testimonials_status_check | CHECK | - | testimonials.status |
| 2200_73742_9_not_null | CHECK | - | - |
| testimonials_rating_check | CHECK | - | testimonials.rating |
| 2200_73742_1_not_null | CHECK | - | - |
| 2200_73742_2_not_null | CHECK | - | - |
| 2200_73742_3_not_null | CHECK | - | - |
| 2200_73742_6_not_null | CHECK | - | - |
| 2200_73742_7_not_null | CHECK | - | - |
| 2200_73742_8_not_null | CHECK | - | - |
| testimonials_rating_id_fkey | FOREIGN KEY | rating_id | ratings.id |
| testimonials_pkey | PRIMARY KEY | id | testimonials.id |

---

