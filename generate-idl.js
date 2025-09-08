const anchor = require('@coral-xyz/anchor');
const fs = require('fs');
const path = require('path');

async function generateIdl() {
  // Укажите путь к вашему рабочему пространству
  const workspacePath = path.resolve(__dirname);
  
  // Загрузите рабочее пространство
  const workspace = anchor.Workspace.load(workspacePath);
  
  // Получите программу
  const program = workspace.programs.get('your_program_name');
  
  if (program) {
    // Генерируем IDL
    const idl = program.idl;
    
    // Сохраняем в файл
    const idlPath = path.join(__dirname, 'target', 'idl', `${program.name}.json`);
    fs.mkdirSync(path.dirname(idlPath), { recursive: true });
    fs.writeFileSync(idlPath, JSON.stringify(idl, null, 2));
    
    console.log(`IDL сгенерирован: ${idlPath}`);
  } else {
    console.error('Программа не найдена в рабочем пространстве');
  }
}

generateIdl().catch(console.error);