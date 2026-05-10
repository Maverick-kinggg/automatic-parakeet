CREATE TABLE public.drawing_categories (
  id SERIAL PRIMARY KEY,
  corp_id VARCHAR(128),
  emp_id VARCHAR(128),
  name VARCHAR(128) NOT NULL,
  code VARCHAR(64),
  parent_id INTEGER,
  sort_order INTEGER DEFAULT 0,
  description TEXT,
  drawing_count INTEGER DEFAULT 0,
  is_deleted CHAR(1) DEFAULT 'n',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE public.drawings (
  id SERIAL PRIMARY KEY,
  corp_id VARCHAR(128),
  emp_id VARCHAR(128),
  name VARCHAR(256) NOT NULL,
  code VARCHAR(64),
  category_id INTEGER,
  file_path VARCHAR(512) NOT NULL,
  file_name VARCHAR(256) NOT NULL,
  file_size BIGINT,
  file_format VARCHAR(16),
  version VARCHAR(32) DEFAULT 'v1.0',
  status VARCHAR(16) DEFAULT 'published',
  description TEXT,
  download_count INTEGER DEFAULT 0,
  thumbnail_path VARCHAR(512),
  is_deleted CHAR(1) DEFAULT 'n',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE public.drawing_versions (
  id SERIAL PRIMARY KEY,
  corp_id VARCHAR(128),
  emp_id VARCHAR(128),
  drawing_id INTEGER NOT NULL,
  version VARCHAR(32) NOT NULL,
  file_path VARCHAR(512) NOT NULL,
  file_name VARCHAR(256) NOT NULL,
  file_size BIGINT,
  change_description TEXT,
  is_current CHAR(1) DEFAULT 'n',
  is_deleted CHAR(1) DEFAULT 'n',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE public.download_records (
  id SERIAL PRIMARY KEY,
  corp_id VARCHAR(128),
  emp_id VARCHAR(128) NOT NULL,
  drawing_id INTEGER NOT NULL,
  download_time TIMESTAMP DEFAULT NOW(),
  ip_address VARCHAR(64),
  user_agent TEXT,
  is_deleted CHAR(1) DEFAULT 'n',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
