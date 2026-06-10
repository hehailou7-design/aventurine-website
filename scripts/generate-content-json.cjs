/**
 * 从 ContentContext.tsx 的 defaultContent 生成 public/data/content.json
 * 
 * 使用词法分析器安全地处理 TypeScript 语法，避免 URL 中的 // 被误删
 * 
 * 注意：如果 content.json 已存在（CMS 已发布过），则跳过生成，
 * 以保留 CMS 推送的最新内容。
 */
const fs = require('fs');
const path = require('path');

const ctxPath = path.join(__dirname, '..', 'src', 'context', 'ContentContext.tsx');
const outPath = path.join(__dirname, '..', 'public', 'data', 'content.json');

// 如果 content.json 已存在，跳过生成（保留 CMS 发布的内容）
if (fs.existsSync(outPath)) {
  console.log('⏭️  content.json 已存在，跳过生成（保留 CMS 发布内容）');
  console.log('   文件大小:', fs.statSync(outPath).size, 'bytes');
  process.exit(0);
}

let src = fs.readFileSync(ctxPath, 'utf-8');

// 1. 找到 const defaultContent: SiteContent = { ... };
const startMatch = src.match(/const\s+defaultContent\s*:\s*SiteContent\s*=\s*\{/);
if (!startMatch) {
  console.error('ERROR: 找不到 defaultContent 定义');
  process.exit(1);
}

const startIdx = startMatch.index + startMatch[0].length - 1; // 指向 {

// 2. 括号匹配找到结束的 }
let depth = 0;
let endIdx = startIdx;
for (let i = startIdx; i < src.length; i++) {
  const ch = src[i];
  // 跳过字符串内容
  if (ch === "'" || ch === '"') {
    const quote = ch;
    i++;
    while (i < src.length) {
      if (src[i] === '\\') { i += 2; continue; }
      if (src[i] === quote) break;
      i++;
    }
    continue;
  }
  // 跳过单行注释
  if (ch === '/' && src[i+1] === '/') {
    while (i < src.length && src[i] !== '\n') i++;
    continue;
  }
  // 跳过多行注释
  if (ch === '/' && src[i+1] === '*') {
    i += 2;
    while (i < src.length && !(src[i] === '*' && src[i+1] === '/')) i++;
    i++;
    continue;
  }
  
  if (ch === '{') depth++;
  else if (ch === '}') {
    depth--;
    if (depth === 0) {
      endIdx = i;
      if (src[i + 1] === ';') endIdx = i + 1;
      break;
    }
  }
}

let code = src.substring(startIdx, endIdx + 1);
if (code.endsWith(';')) code = code.slice(0, -1);

// 3. 清理 TypeScript 特定语法 —— 用词法分析器
// 步骤: 逐字符处理，区分字符串内和字符串外
function cleanTypescript(ts) {
  let out = '';
  let i = 0;
  
  while (i < ts.length) {
    const ch = ts[i];
    
    // 字符串字面量 —— 原样保留
    if (ch === "'" || ch === '"') {
      const quote = ch;
      out += ch;
      i++;
      while (i < ts.length) {
        if (ts[i] === '\\') {
          out += ts[i] + (ts[i+1] || '');
          i += 2;
          continue;
        }
        out += ts[i];
        if (ts[i] === quote) { i++; break; }
        i++;
      }
      continue;
    }
    
    // 单行注释
    if (ch === '/' && ts[i+1] === '/') {
      while (i < ts.length && ts[i] !== '\n') i++;
      // 保留换行
      continue;
    }
    
    // 多行注释
    if (ch === '/' && ts[i+1] === '*') {
      i += 2;
      while (i < ts.length && !(ts[i] === '*' && ts[i+1] === '/')) i++;
      i += 2;
      continue;
    }
    
    // 正则表达式字面量 —— 这里有风险，但 defaultContent 不含正则
    // 可以忽略
    
    // "as const" / "as 'grid'" 等类型断言
    if (ch === ' ' && ts.substring(i+1, i+4) === 'as ') {
      // 读取 "as" 后面的内容直到逗号、换行或 }
      let j = i + 4; // 跳过 " as "
      // 跳过 as 后面的单词或引号字符串
      if (ts[j] === "'" || ts[j] === '"') {
        const q = ts[j];
        j++;
        while (j < ts.length && ts[j] !== q) {
          if (ts[j] === '\\') j++;
          j++;
        }
        j++; // 跳过结束引号
      } else {
        while (j < ts.length && /[a-zA-Z0-9_\[\]]/.test(ts[j])) j++;
      }
      i = j;
      continue;
    }
    
    out += ch;
    i++;
  }
  
  return out;
}

code = cleanTypescript(code);

// 4. 尾部逗号清理
code = code.replace(/,(\s*[}\]])/g, '$1');

// 5. 给未引用的 key 加引号
code = code.replace(/([{,]\s*)([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:/g, '$1"$2":');

// 6. 规范化空白
code = code.replace(/[ \t]+/g, ' ');

// 7. eval
let obj;
try {
  const fn = new Function('return ' + code);
  obj = fn();
} catch (e) {
  console.error('Eval 失败:', e.message);
  console.error('错误位置附近:');
  // 尝试定位错误
  const m = e.message.match(/position\s+(\d+)/i);
  if (m) {
    const pos = parseInt(m[1]);
    console.error(code.substring(Math.max(0, pos - 60), pos + 60));
  }
  fs.writeFileSync(path.join(__dirname, '..', 'debug_obj_code.txt'), code.slice(0, 20000));
  console.error('已保存调试内容到 debug_obj_code.txt');
  process.exit(1);
}

// 8. 写入
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, JSON.stringify(obj, null, 2), 'utf-8');

console.log('✅ 成功生成:', outPath);
console.log('   文件大小:', fs.statSync(outPath).size, 'bytes');
console.log('   顶层 key:', Object.keys(obj).join(', '));
