export default 'SELECT * FROM projects_files JOIN files ON projects_files.file_id = files.id WHERE project_id = $1 AND category = $2'
