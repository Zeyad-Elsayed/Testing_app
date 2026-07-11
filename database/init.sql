CREATE TABLE IF NOT EXISTS clients (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(30),
  unit_name VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO clients (name, phone, unit_name)
VALUES 
  ('Ahmed Mohamed', '01000000000', 'Villa A1'),
  ('Mona Ali', '01111111111', 'Apartment B2');