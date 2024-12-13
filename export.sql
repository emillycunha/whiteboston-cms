CREATE TABLE contacts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    org_id INTEGER NOT NULL,
    owner_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    source TEXT,
    notes TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
);

INSERT INTO contacts (org_id, owner_id, name, email, phone, source, notes, created_at, updated_at)
VALUES 
(1, 1, 'John Doe', 'john.doe@example.com', '123-456-7890', 'Website', 'Interested in premium services.', '2023-12-01T10:00:00Z', '2023-12-05T14:30:00Z'),
(1, 2, 'Jane Smith', 'jane.smith@example.com', '987-654-3210', 'Referral', 'Requested a callback for further discussion.', '2023-12-03T09:00:00Z', '2023-12-06T11:15:00Z'),
(2, 3, 'Alice Johnson', 'alice.johnson@example.com', '555-678-1234', 'Event', 'Met at the networking event last week.', '2023-12-07T08:30:00Z', '2023-12-08T13:45:00Z');

CREATE TABLE leads (
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    name TEXT NOT NULL,                   
    email TEXT NOT NULL,            
    phone TEXT,     
    interest TEXT,    
    submitted_at TEXT NOT NULL    
);
INSERT INTO leads VALUES(1,'John Doe','john.doe@example.com','123-456-7890','Product','2023-12-07T08:30:00Z');

CREATE TABLE tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT, -- Unique identifier for each task
    title TEXT NOT NULL,                  -- Title of the task
    description TEXT,                     -- Description or email
    completed BOOLEAN NOT NULL DEFAULT 0, -- Task completion status (true/false)
    notes TEXT,                           -- Additional notes
    created_at TEXT NOT NULL,             -- Creation timestamp in ISO 8601 format
    due_date TEXT                         -- Due date timestamp in ISO 8601 format
);

INSERT INTO tasks VALUES(1,'John Doe','john.doe@example.com',0,'Interested in premium services.','2023-12-01T10:00:00Z','2023-12-05T14:30:00Z');