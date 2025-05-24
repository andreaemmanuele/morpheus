export default `
CREATE TABLE IF NOT EXISTS projects_files (
    id SERIAL PRIMARY KEY,
    project_id INTEGER references projects(id) ON DELETE CASCADE,
    file_id INTEGER references files(id) ON DELETE CASCADE,
    category VARCHAR(50) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_projects_project_id ON projects_files(project_id);
CREATE INDEX IF NOT EXISTS idx_projects_category ON projects_files(category);`
