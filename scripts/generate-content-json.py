#!/usr/bin/env python3
"""从 ContentContext.tsx 的 defaultContent 生成 public/data/content.json"""

import re
import json
import os
import sys

def extract_default_content(filepath):
    """从 TypeScript 文件中提取 defaultContent 对象并转为 JSON"""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 找到 defaultContent 的起始位置
    match = re.search(r'const defaultContent:\s*SiteContent\s*=\s*\{', content)
    if not match:
        print("ERROR: 找不到 defaultContent 定义")
        return None
    
    start_pos = match.start()
    # 从 { 之后开始提取
    brace_start = match.end() - 1  # 指向 {
    
    # 使用括号匹配找到对应的 }
    depth = 0
    end_pos = brace_start
    for i in range(brace_start, len(content)):
        if content[i] == '{':
            depth += 1
        elif content[i] == '}':
            depth -= 1
            if depth == 0:
                end_pos = i + 1
                break
    
    ts_code = content[brace_start:end_pos]
    
    # 清理 TypeScript 语法 → 变为有效 JSON
    # 1. 移除 // 单行注释
    ts_code = re.sub(r'//.*$', '', ts_code, flags=re.MULTILINE)
    
    # 2. 移除 as const, as 'xxx', as any, as Type 等类型断言
    #    匹配模式: 值后面跟 as something,
    #    例如: 'grid' as const, → 'grid',
    #          'grid' as const → 'grid'
    #          12 as const, → 12,
    ts_code = re.sub(r'\bas\s+(const|any|\'[^\']*\'|"[^"]*"|\w+(?:\[\])?)\b', '', ts_code)
    
    # 3. 清理多余的空白（可选，但有助于后续处理）
    
    # 4. 移除多余的逗号 (尾部逗号在 JSON 中非法)
    #    但这里不做，因为我们要传给 JS eval
    
    # 5. 将单引号字符串转换为双引号
    #    注意：需要处理字符串内的转义
    #    简单策略：替换所有用单引号的字符串
    def replace_single_quotes(s):
        """将 JS 单引号字符串转为双引号"""
        result = []
        i = 0
        while i < len(s):
            if s[i] == "'":
                # 找到匹配的结束引号
                j = i + 1
                while j < len(s):
                    if s[j] == '\\':
                        j += 2  # 跳过转义字符
                    elif s[j] == "'":
                        break
                    else:
                        j += 1
                # 提取字符串内容，将单引号转为双引号
                inner = s[i+1:j]
                # 转义内部的双引号
                inner = inner.replace('"', '\\"')
                # 反转义单引号
                inner = inner.replace("\\'", "'")
                result.append('"' + inner + '"')
                i = j + 1
            else:
                result.append(s[i])
                i += 1
        return ''.join(result)
    
    ts_code = replace_single_quotes(ts_code)
    
    # 6. 为未引用的 key 添加引号（JSON 要求 key 必须是字符串）
    #    匹配模式: 在对象中，key: value 中的 key 需要引号
    #    但要小心不匹配已经在字符串中的内容
    ts_code = re.sub(r'([{,]\s*)([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:', 
                     lambda m: m.group(1) + '"' + m.group(2) + '" :', ts_code)
    
    # 修复上一步可能引入的多余空格
    ts_code = re.sub(r'"\s+:', '":', ts_code)
    
    # 7. 移除多余逗号（在 } 或 ] 之前的逗号）
    ts_code = re.sub(r',(\s*[}\]])', r'\1', ts_code)
    
    # 8. 处理空值/undefined → null
    ts_code = re.sub(r'\bundefined\b', 'null', ts_code)
    
    # 9. 清理多余空格和换行
    ts_code = re.sub(r'[ \t]+', ' ', ts_code)
    
    # 10. 去掉 } 后面可能跟着的 ; 
    ts_code = ts_code.strip()
    if ts_code.endswith(';'):
        ts_code = ts_code[:-1]
    
    # 尝试用 JSON 解析
    try:
        obj = json.loads(ts_code)
        return obj
    except json.JSONDecodeError as e:
        print(f"JSON 解析失败: {e}")
        print(f"错误位置附近的内容: ...{ts_code[max(0,e.pos-50):e.pos+50]}...")
        # 保存调试文件
        debug_path = os.path.join(os.path.dirname(filepath), '..', 'debug_ts_code.json')
        with open(debug_path, 'w', encoding='utf-8') as f:
            f.write(ts_code[:5000])
        print(f"已保存调试内容到: {debug_path}")
        return None

def main():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    project_dir = os.path.dirname(script_dir)
    ctx_path = os.path.join(project_dir, 'src', 'context', 'ContentContext.tsx')
    out_path = os.path.join(project_dir, 'public', 'data', 'content.json')
    
    if not os.path.exists(ctx_path):
        print(f"ERROR: 找不到文件 {ctx_path}")
        sys.exit(1)
    
    print(f"从 {ctx_path} 提取 defaultContent...")
    obj = extract_default_content(ctx_path)
    
    if obj is None:
        print("提取失败，尝试备用方案...")
        # 备用方案: 用 Node.js eval
        sys.exit(1)
    
    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    with open(out_path, 'w', encoding='utf-8') as f:
        json.dump(obj, f, ensure_ascii=False, indent=2)
    
    print(f"成功生成: {out_path}")
    print(f"文件大小: {os.path.getsize(out_path)} bytes")

if __name__ == '__main__':
    main()
