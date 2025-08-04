#!/usr/bin/env node
import { program } from 'commander';
import inquirer from 'inquirer';
import path from 'path';
import fs from 'fs-extra';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// 确保目录分隔符在 Windows 上正常工作
path.join(__dirname, 'templates');

console.log('程序启动了', program);

// 工具函数
async function generateProjectStructure(projectDir, parentDir, options) {
  try {
    // 复制基础文件
    const parantTemp = path.join(__dirname, 'templates');
    const templatePath = path.join(__dirname, 'templates', options.template);
    if (!fs.existsSync(templatePath)) {
      console.error(`模板目录不存在: ${templatePath}`);
      return;
    }
    fs.copySync(templatePath, projectDir);
    // 读取模板类型目录下的所有文件和目录
    const files = fs.readdirSync(parantTemp);
    // 遍历并只复制文件
    files.forEach(file => {
      const sourcePath = path.join(parantTemp, file);
      const targetPath = path.join(parentDir, file);
      
      // 检查是否是文件
      if (fs.statSync(sourcePath).isFile()) {
        fs.copyFileSync(sourcePath, targetPath);
        console.log(`Copied file: ${file}`);
      }
    }); 
    // 更新package.json
    const packageJsonPath = path.join(__dirname, 'templates', 'package.json');
    console.log(packageJsonPath, 'packageJsonPath');
    if (fs.existsSync(packageJsonPath)) {
      const packageJson = fs.readJsonSync(packageJsonPath);
      packageJson.name = options.projectName;
      fs.writeJsonSync(packageJsonPath, packageJson, { spaces: 2 });
    } else {
      console.error(`package.json 不存在: ${packageJsonPath}`);
    }
  } catch (error) {
    console.error('生成项目结构出错:', error);
  }
}

// 定义版本和描述
program
  .version('1.0.0')
  .description('Command line tool for installing components in threedAdmin project');

// 初始化项目命令
program
  .command('init')
  .description('Initialize a new threedAdmin project')
  .action(async () => {
    console.log('开始执行初始化命令');
    try {
      const answers = await inquirer.prompt([
        { type: 'input', name: 'projectName', message: 'Enter project name:', default: 'threed-admin' },
        { type: 'list', name: 'template', message: 'Select template:', choices: ['basic', 'full', 'src'] },
        { type: 'confirm', name: 'useTypescript', message: 'Use TypeScript?', default: true }
      ]);

      console.log(`Initializing project: ${answers.projectName} with template: ${answers.template}`);
      // 创建项目目录
      const projectDir = path.join(process.cwd(), answers.projectName);
      fs.ensureDirSync(projectDir);
      const templateDir = path.join(projectDir, answers.template);
      fs.ensureDirSync(templateDir);
      const publicDir = path.join(projectDir, 'public');
      fs.ensureDirSync(publicDir);
      // 生成基础文件结构
      await generateProjectStructure(templateDir, projectDir, answers);
      console.log(`Project initialized successfully at ${projectDir}`);
    } catch (error) {
      console.error('初始化项目出错:', error);
    }
  });

// 生成页面命令
program
  .command('generate:page <name>')
  .description('Generate a new page')
  .option('-r, --route', 'Add route entry', true)
  .action(async (name, options) => {
    console.log(`开始生成页面: ${name}`);
    try {
      const pageDir = path.join(process.cwd(), 'src', 'views', name);
      fs.ensureDirSync(pageDir);

      // 这里应该实现 generatePageFiles 和 addRouteEntry 函数
      console.log(`页面目录已创建: ${pageDir}`);

      // 添加路由的逻辑可以在这里实现
      if (options.route) {
        console.log('路由将被添加');
        // addRouteEntry(name);
      }

      console.log(`Page ${name} generated successfully at ${pageDir}`);
    } catch (error) {
      console.error('生成页面出错:', error);
    }
  });

// 解析命令行参数 - 这是关键步骤，不能缺少
program.parse(process.argv);

// 如果没有提供命令，显示帮助信息
if (!process.argv.slice(2).length) {
  program.outputHelp();
}