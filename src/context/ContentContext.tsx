import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import type { ReactNode } from 'react'
import type { PageBuilderData } from '../types/pageBuilder'

export interface BannerSlide {
  tagline: string;
  subtitle: string;
  accent: string;
  image: string;
}

export interface NavCard {
  label: string;
  desc: string;
}

export interface UpdateItem {
  date: string;
  text: string;
  tag: string;
}

export interface CharacterTabContent {
  title: string;
  body: string;
}

export interface MaterialItem {
  title: string;
  desc: string;
  tag: string;
  image: string;
  date?: string;
  link?: string;
  clickAction?: string;
  customLink?: string;
  videoUrl?: string;
  interactiveUrl?: string;
}

export interface CollabStore {
  name: string;
  city: string;
  time: string;
  category: string;
  image: string;
}

export interface MerchItem {
  name: string;
  price: string;
  version: string;
  type: string;
  image: string;
}

export interface TimelineEvent {
  date: string;
  title: string;
  desc: string;
  image?: string;
}

export interface GuideItem {
  title: string;
  content: string;
}

export interface ComparisonItem {
  charName: string;
  survival: number;
  shield: number;
  damage: number;
}

// 角色技能
export interface CharacterSkill {
  key: string;
  name_zh: string;
  name_en: string;
  type: string;
  energyCost?: number;
  energyGen?: number;
  spCost?: number;
  desc_zh: string;
  desc_en: string;
  icon: string;
}

// 星魂
export interface CharacterEidolon {
  level: number;
  name_zh: string;
  name_en: string;
  desc_zh: string;
  desc_en: string;
  icon: string;
}

// 行迹（额外能力）
export interface CharacterTrace {
  key: string;
  name_zh: string;
  name_en: string;
  desc_zh: string;
  desc_en: string;
  unlockCondition: string;
  icon: string;
}

// 角色故事
export interface CharacterStory {
  level: number;
  title_zh: string;
  title_en: string;
  body_zh: string;
  body_en: string;
}

// ============ 审核相关类型 ============

// 意见反馈
export interface FeedbackItem {
  id: string;
  nickname: string;
  email?: string;
  content: string;
  rating?: number;  // 满意度评分 1-5
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  reviewNote?: string;
}

// 生贺组应聘
export interface SponsorshipApplication {
  id: string;
  nickname: string;
  contact: string;  // 联系方式（小红书/微博/邮箱）
  experience: string;  // 相关经验
  contribution: string;  // 可以贡献的内容
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  reviewNote?: string;
}

// 板块更新提交
export interface ContentUpdateSubmission {
  id: string;
  nickname: string;
  section: string;  // 要更新的板块
  field?: string;  // 要更新的字段（可选）
  oldValue: string;  // 原值
  newValue: string;  // 新值
  reason: string;  // 修改理由
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  reviewNote?: string;
}

// 黑泥区审核申请（已有，这里补充完整类型）
// BlackmudUser 类型已在 BlackMudPage.tsx 中定义
export interface CharacterVoice {
  trigger: string;
  text_zh: string;
  text_en: string;
}

// 角色设定框字段（可自定义样式、类型）
export interface CharacterProfileField {
  id: string;
  label: string;
  value: string;
  type?: 'text' | 'image';  // 字段类型：文本或图片
  image?: string;  // 当type为image时，存储图片URL或base64
  labelColor?: string;
  valueColor?: string;
  fontSize?: number;
  fontWeight?: string;
  fontStyle?: string;
  textAlign?: string;
}

export interface CharacterProfileBox {
  id: string;
  title: string;
  fields: CharacterProfileField[];
  layout: 'grid' | 'list';
  background?: string;
  border?: string;
  borderRadius?: number;
  titleColor?: string;
  titleFontSize?: number;
}

// 角色基础信息
export interface CharacterBasicInfo {
  nameZh: string;
  nameEn: string;
  rarity: number;
  path: string;
  element: string;
  faction: string;
  world: string;
  gender: string;
  birthday: string;
  cvZh: string;
  cvEn: string;
  cvJp: string;
  cvKo: string;
}

export type SiteContent = {
  home: {
    bannerSlides: BannerSlide[];
    navCards: (NavCard & { key: string; icon: string; color: string })[];
    updates: UpdateItem[];
    aboutText: string;
  };
  character: {
    intro: string;
    characterArt: string;
    basicInfo: CharacterBasicInfo;
    profileBoxes: CharacterProfileBox[];
    skills: CharacterSkill[];
    eidolons: CharacterEidolon[];
    traces: CharacterTrace[];
    stories: CharacterStory[];
    voices: CharacterVoice[];
    tabs: { profile: string; story: string; voice: string; research: string };
  };
  materials: {
    officialTitle: string;
    offlineTitle: string;
    official: MaterialItem[];
    offline: MaterialItem[];
  };
  collaboration: {
    storesTitle: string;
    merchTitle: string;
    stores: CollabStore[];
    merch: MerchItem[];
  };
  chronicle: {
    timelineTitle: string;
    events: TimelineEvent[];
  };
  strength: {
    guidesTitle?: string;
    compareTitle?: string;
    guides?: GuideItem[];
    comparisons?: ComparisonItem[];
    teamBuilds?: any[];
    relicSets?: any[];
    compareData?: any[];
    comments?: any[];
    eidolonData?: any[];
    characterList?: string[];
  };
  blackMud: {
    pageTitle: string;
    warningText: string;
    requireVerify: boolean;
  };
  submit: {
    newsTitle: string;
    photoTitle: string;
    updateTitle: string;
    guidelines: string;
  };
  blessings: {
    pageTitle: string;
    subtitle: string;
  };
  supportRecord: {
    pageTitle: string;
    records: { date: string; title: string; location: string; desc: string; image: string; tag: string }[];
  };
  theme: {
    primaryColor: string;
    secondaryColor: string;
    backgroundColor: string;
    cardStyle: 'glass' | 'solid' | 'gradient';
    fontSize: 'small' | 'medium' | 'large';
    borderRadius: number;
  };
  pageBuilder?: PageBuilderData;
}

const defaultContent: SiteContent = {
  home: {
    bannerSlides: [
      { tagline: '世界的一次性赌注 · 从不食言的赌徒', subtitle: '我们终将会在极光下重逢', accent: '#d4b878', image: '' },
      { tagline: 'IPC战略投资部长 · 匹诺康尼来客', subtitle: '所有的命运都是早已注定的赌局', accent: '#b0a0d8', image: '' },
      { tagline: '亲爱的，你输定了 · 但是与我共赴盛宴', subtitle: '砂金·Aventurine 全球粉丝应援', accent: '#9cba8a', image: '' },
    ],
    navCards: [
      { key: 'character', icon: '◆', label: '角色设定', desc: '档案·剧情·台词·考据', color: '#d4b878' },
      { key: 'materials', icon: '◇', label: '角色物料', desc: '官方原画·应援印刷品', color: '#c4a868' },
      { key: 'collaboration', icon: '★', label: '官方联动', desc: '联名门店·周边图鉴', color: '#d4b878' },
      { key: 'chronicle', icon: '◈', label: '角色编年史', desc: '时间轴·大事记', color: '#9cba8a' },
      { key: 'strength', icon: '⚔', label: '强度专区', desc: '攻略·配队·遗器', color: '#e0c060' },
      { key: 'blackmud', icon: '◉', label: '黑泥区', desc: '理性吐槽·有话好说', color: '#888' },
      { key: 'submit', icon: '✉', label: '投稿区', desc: '最新动态·线下实拍·板块更新', color: '#b0a0d8' },
      { key: 'account', icon: '⊡', label: '账户中心', desc: '登录·注册·设置', color: '#d4b878' },
      { key: 'profile', icon: '⊙', label: '个人中心', desc: '投稿·收藏', color: '#c4a868' },
      { key: 'blessings', icon: '♥', label: '祝福区', desc: '留下对砂金的祝福', color: '#d4b878' },
    ],
    updates: [
      { date: '2026.06.09', text: '砂金线下大屏应援 · 上海IFC商圈投放', tag: '线下' },
      { date: '2026.05.24', text: '3.3版本限定UP池再次复刻，获取率提升', tag: '游戏' },
      { date: '2026.04.18', text: '匹诺康尼联名咖啡馆限定周边全线上架', tag: '联动' },
      { date: '2026.03.30', text: '角色专属立绘手幅第二批预售开始', tag: '物料' },
    ],
    aboutText: '这里是砂金·Aventurine 全球粉丝应援站，由世界各地的骰子守望者共同维护。\n我们在这里收录一切关于他的美好——从每一张立绘，到每一行台词。',
  },
  character: {
    intro: '砂金 Aventurine — 崩坏：星穹铁道 · 五星角色 · 虚数属性 · 存护命途',
    characterArt: '/images/wiki/character_art.png',
    basicInfo: {
      nameZh: '砂金',
      nameEn: 'Aventurine',
      rarity: 5,
      path: '存护',
      element: '虚数',
      faction: '星际和平公司 · 石心十人',
      world: '茨冈尼亚-Ⅳ',
      gender: '男',
      birthday: '未知',
      cvZh: '杨超然',
      cvEn: 'Camden Sutkowski',
      cvJp: '河西健吾',
      cvKo: '박준원',
    },
    profileBoxes: [
      {
        id: 'basic-info',
        title: '基本信息',
        layout: 'grid',
        titleColor: '#d4b878',
        titleFontSize: 12,
        background: 'rgba(212,184,120,0.05)',
        border: '1px solid rgba(212,184,120,0.15)',
        borderRadius: 10,
        fields: [
          { id: 'f1', label: '中文名', value: '砂金', labelColor: '#d4b878', valueColor: '#f2e8d0', fontSize: 15, fontWeight: '600', fontStyle: 'normal', textAlign: 'left' },
          { id: 'f2', label: '外文名', value: 'Aventurine', labelColor: '#d4b878', valueColor: '#f2e8d0', fontSize: 15, fontWeight: '600', fontStyle: 'normal', textAlign: 'left' },
          { id: 'f3', label: '本名', value: '卡卡瓦夏（Kakavasha）', labelColor: '#d4b878', valueColor: '#f2e8d0', fontSize: 15, fontWeight: '600', fontStyle: 'normal', textAlign: 'left' },
          { id: 'f4', label: '稀有度', value: '★★★★★', labelColor: '#d4b878', valueColor: '#f2e8d0', fontSize: 15, fontWeight: '600', fontStyle: 'normal', textAlign: 'left' },
          { id: 'f5', label: '命途', value: '存护（Preservation）', labelColor: '#d4b878', valueColor: '#f2e8d0', fontSize: 15, fontWeight: '600', fontStyle: 'normal', textAlign: 'left' },
          { id: 'f6', label: '战斗属性', value: '虚数（Imaginary）', labelColor: '#d4b878', valueColor: '#f2e8d0', fontSize: 15, fontWeight: '600', fontStyle: 'normal', textAlign: 'left' },
        ],
      },
      {
        id: 'detail-info',
        title: '详细信息',
        layout: 'list',
        titleColor: '#d4b878',
        titleFontSize: 12,
        background: 'rgba(212,184,120,0.05)',
        border: '1px solid rgba(212,184,120,0.15)',
        borderRadius: 10,
        fields: [
          { id: 'f10', label: '阵营', value: '星际和平公司 · 石心十人', labelColor: 'rgba(242,232,208,0.9)', valueColor: 'rgba(242,232,208,0.9)', fontSize: 13, fontWeight: 'normal', fontStyle: 'normal', textAlign: 'left' },
          { id: 'f11', label: '部门', value: '战略投资部 · 高级干部', labelColor: 'rgba(242,232,208,0.9)', valueColor: 'rgba(242,232,208,0.9)', fontSize: 13, fontWeight: 'normal', fontStyle: 'normal', textAlign: 'left' },
          { id: 'f12', label: '性别', value: '男', labelColor: 'rgba(242,232,208,0.9)', valueColor: 'rgba(242,232,208,0.9)', fontSize: 13, fontWeight: 'normal', fontStyle: 'normal', textAlign: 'left' },
          { id: 'f13', label: '种族', value: '埃维金人', labelColor: 'rgba(242,232,208,0.9)', valueColor: 'rgba(242,232,208,0.9)', fontSize: 13, fontWeight: 'normal', fontStyle: 'normal', textAlign: 'left' },
          { id: 'f14', label: '出身', value: '茨冈尼亚-Ⅳ', labelColor: 'rgba(242,232,208,0.9)', valueColor: 'rgba(242,232,208,0.9)', fontSize: 13, fontWeight: 'normal', fontStyle: 'normal', textAlign: 'left' },
          { id: 'f15', label: '实装日期', value: '2024年04月17日（2.1版本）', labelColor: 'rgba(242,232,208,0.9)', valueColor: 'rgba(242,232,208,0.9)', fontSize: 13, fontWeight: 'normal', fontStyle: 'normal', textAlign: 'left' },
        ],
      },
      {
        id: 'cv-info',
        title: '声优信息',
        layout: 'list',
        titleColor: '#d4b878',
        titleFontSize: 12,
        background: 'rgba(212,184,120,0.05)',
        border: '1px solid rgba(212,184,120,0.15)',
        borderRadius: 10,
        fields: [
          { id: 'f20', label: 'CV（中）', value: '杨超然', labelColor: 'rgba(242,232,208,0.9)', valueColor: 'rgba(242,232,208,0.9)', fontSize: 13, fontWeight: 'normal', fontStyle: 'normal', textAlign: 'left' },
          { id: 'f21', label: 'CV（日）', value: '河西健吾', labelColor: 'rgba(242,232,208,0.9)', valueColor: 'rgba(242,232,208,0.9)', fontSize: 13, fontWeight: 'normal', fontStyle: 'normal', textAlign: 'left' },
          { id: 'f22', label: 'CV（英）', value: 'Camden Sutkowski', labelColor: 'rgba(242,232,208,0.9)', valueColor: 'rgba(242,232,208,0.9)', fontSize: 13, fontWeight: 'normal', fontStyle: 'normal', textAlign: 'left' },
          { id: 'f23', label: 'CV（韩）', value: '박준원', labelColor: 'rgba(242,232,208,0.9)', valueColor: 'rgba(242,232,208,0.9)', fontSize: 13, fontWeight: 'normal', fontStyle: 'normal', textAlign: 'left' },
        ],
      },
    ],
    skills: [
      {
        key: 'basic',
        name_zh: '直观投注',
        name_en: 'Straight Bet',
        type: 'basic',
        energyGen: 20,
        desc_zh: '对指定敌方单体造成等同于砂金50%防御力的虚数属性伤害。',
        desc_en: 'Deals Imaginary DMG equal to 50% of Aventurine\'s DEF to a single enemy.',
        icon: '/images/wiki/skill_basic.png',
      },
    ],
    eidolons: [],
    traces: [],
    stories: [],
    voices: [],
    tabs: { profile: '...', story: '...', voice: '...', research: '...' },
  },
  materials: {
    officialTitle: '官方原画',
    offlineTitle: '物料整理',
    official: [
      { title: '砂金官方立绘（横版）', desc: '崩坏：星穹铁道官方立绘，横版全身', tag: '立绘', image: 'https://upload-static.hoyoverse.com/event/2024/02/28/7c42b3c5d5d5f5e5c5d5e5c5d5e5c5.png', date: '2024.02.28', link: 'https://www.miyoushe.com/sr/article/50218448', clickAction: 'link' },
      { title: '砂金官方立绘（竖版）', desc: '崩坏：星穹铁道官方立绘，竖版全身', tag: '立绘', image: 'https://upload-static.hoyoverse.com/event/2024/02/28/8d53c4d6e6f6a6b6c6d6e6f6a6b6c.png', date: '2024.02.28', clickAction: 'none' },
      { title: '砂金透明底立绘', desc: '官方透明背景立绘', tag: '立绘', image: '', date: '2024.03.01', clickAction: 'none' },
      { title: '2.1版本PV「狂热奔向深渊」', desc: '砂金角色PV「金手指」，官方完整版', tag: 'PV', image: '', date: '2024.03.15', link: 'https://www.bilibili.com/video/BV12x421m7K9', clickAction: 'video' },
      { title: '砂金官图自存（第一弹）', desc: '官方宣传图集合', tag: '宣传图', image: '', date: '2024.03.09', link: 'https://www.miyoushe.com/sr/article/50129960', clickAction: 'link' },
      { title: '砂金官图自存（第二弹）', desc: '更多官方宣传图', tag: '宣传图', image: '', date: '2024.03.12', link: 'https://www.miyoushe.com/sr/article/50218448', clickAction: 'link' },
      { title: '214情人节特别电影宣传图', desc: '情人节特别活动宣传', tag: '宣传图', image: '', date: '2024.02.14', clickAction: 'none' },
      { title: '砂金anan杂志封面', desc: '日本anan杂志封面，砂金主题', tag: '杂志', image: '', date: '2024.03.20', clickAction: 'none' },
      { title: '英推嘉年华宣图', desc: '英国Twitter嘉年华活动宣传图', tag: '宣传图', image: '', date: '2024.04.01', clickAction: 'none' },
      { title: '砂金壁纸高清无水印（第一弹）', desc: '高清壁纸收藏集第一弹', tag: '壁纸', image: '', date: '2024.05.04', link: 'https://www.miyoushe.com/sr/article/52420580', clickAction: 'link' },
      { title: '砂金壁纸高清无水印（第二弹）', desc: '高清壁纸收藏集第二弹', tag: '壁纸', image: '', date: '2024.05.25', clickAction: 'none' },
    ],
    offline: [
      { title: '茶百道联动联名吊牌', desc: '崩铁X茶百道联动，可固定联名吊牌', tag: '联动', image: '', date: '2024.04.26', clickAction: 'none' },
      { title: '立绘系列亚克力立牌', desc: '官方立绘亚克力立牌', tag: '周边', image: '', date: '2024.09.01', clickAction: 'none' },
      { title: '主题印象系列 - 条纹衬衫', desc: '砂金主题印象系列，蓝绿/米黄两款', tag: '周边', image: '', date: '2025.03.20', clickAction: 'none' },
      { title: '主题印象系列 - 胸针', desc: '砂金主题印象系列胸针', tag: '周边', image: '', date: '2025.03.20', clickAction: 'none' },
      { title: '主题印象系列 - 戒指套装', desc: '砂金主题印象系列戒指', tag: '周边', image: '', date: '2025.03.20', clickAction: 'none' },
      { title: '主题印象系列 - 手表', desc: '砂金主题印象系列手表，399元', tag: '周边', image: '', date: '2025.03.20', clickAction: 'none' },
      { title: '叽米的会客室 - 迷你马口铁徽章', desc: '砂金迷你马口铁徽章', tag: '周边', image: '', date: '2024.06.01', clickAction: 'none' },
      { title: '叽米的会客室 - 毛绒玩偶挂件', desc: '砂金毛绒玩偶挂件/摆件/公仔', tag: '周边', image: '', date: '2024.06.01', clickAction: 'none' },
      { title: '无名客的奖章 - 亚克力印章摆件', desc: '砂金亚克力印章摆件', tag: '周边', image: '', date: '2024.07.01', clickAction: 'none' },
      { title: 'GSC砂金粘土人手办', desc: '良笑社砂金粘土人手办', tag: '手办', image: '', date: '2025.03.15', clickAction: 'none' },
      { title: '崩铁X中信联动借记卡（砂金卡面）', desc: '中信银行崩铁联动借记卡，砂金卡面', tag: '联动', image: '', date: '2024.09.01', clickAction: 'none' },
      { title: '指尖键帽系列第二弹（砂金）', desc: '砂金Q萌个性键帽公仔', tag: '周边', image: '', date: '2025.06.09', clickAction: 'none' },
    ],
  },
  collaboration: {
    storesTitle: '联名合作门店',
    merchTitle: '官方周边图鉴',
    stores: [
      { name: '米哈游官方周边店（淘宝）', city: '线上', time: '2024.04-至今', category: '官方周边', image: '' },
      { name: '茶百道（联动门店）', city: '全国', time: '2024.04.26-2024.05.26', category: '饮品联动', image: '' },
      { name: '中信银行（联动网点）', city: '全国', time: '2024.09.01-2025.08.31', category: '金融联动', image: '' },
    ],
    merch: [
      { name: '主题印象系列 - 条纹衬衫（蓝绿）', price: '299元', version: '1.0', type: '服装', image: '' },
      { name: '主题印象系列 - 马甲', price: '349元', version: '1.0', type: '服装', image: '' },
      { name: '主题印象系列 - 胸针', price: '69元', version: '1.0', type: '饰品', image: '' },
      { name: '主题印象系列 - 戒指套装', price: '129元', version: '1.0', type: '饰品', image: '' },
      { name: '主题印象系列 - 手链', price: '89元', version: '1.0', type: '饰品', image: '' },
      { name: '主题印象系列 - 手提包', price: '199元', version: '1.0', type: '箱包', image: '' },
      { name: '主题印象系列 - 手表', price: '399元', version: '1.0', type: '饰品', image: '' },
      { name: '叽米的会客室 - 迷你马口铁徽章', price: '39元', version: '1.0', type: '徽章', image: '' },
      { name: '叽米的会客室 - 毛绒玩偶挂件', price: '79元', version: '1.0', type: '毛绒', image: '' },
      { name: '无名客的奖章 - 亚克力印章摆件', price: '59元', version: '1.0', type: '摆件', image: '' },
      { name: 'GSC砂金粘土人手办', price: '499元', version: '1.0', type: '手办', image: '' },
      { name: '砂金角色礼盒', price: '199元', version: '1.0', type: '礼盒', image: '' },
      { name: '指尖键帽系列第二弹（砂金）', price: '89元', version: '2.0', type: '键帽', image: '' },
    ],
  },
  chronicle: {
    timelineTitle: '砂金 · 角色编年史',
    events: [
      { date: '2024.02.14', title: '砂金首次曝光', desc: '214情人节特别电影宣传图流出，砂金角色首次曝光' },
      { date: '2024.02.28', title: '官方立绘发布', desc: '崩坏：星穹铁道官方发布砂金横版/竖版立绘' },
      { date: '2024.03.09', title: '官图自存发布', desc: '官方发布砂金多张宣传图，含表情包、立绘等' },
      { date: '2024.03.12', title: 'anan杂志封面', desc: '砂金登上日本anan杂志封面，日推宣传开始' },
      { date: '2024.03.15', title: '2.1版本PV发布', desc: 'PV「狂热奔向深渊」发布，砂金正式亮相' },
      { date: '2024.04.17', title: '砂金正式上线', desc: '2.1版本「狂热奔向深渊」上线，砂金加入可玩角色' },
      { date: '2024.04.18', title: '首日流水登顶', desc: '砂金首日流水超越黄泉，登顶全服' },
      { date: '2024.04.26', title: '茶百道联动开始', desc: '崩铁X茶百道联动开始，联名吊牌上线' },
      { date: '2024.06.01', title: '叽米的会客室系列', desc: '砂金迷你马口铁徽章、毛绒玩偶等周边上线' },
      { date: '2024.07.01', title: '无名客的奖章系列', desc: '砂金亚克力印章摆件、夹子等周边上线' },
      { date: '2024.09.01', title: '崩铁X中信联动', desc: '中信银行崩铁联动借记卡上线，砂金卡面可选' },
      { date: '2024.12.01', title: '砂金角色礼盒', desc: '砂金主题角色礼盒上线，含多款周边' },
      { date: '2025.03.15', title: 'GSC砂金粘土人手办', desc: '良笑社砂金粘土人手办正式发售' },
      { date: '2025.03.20', title: '主题印象系列上架', desc: '砂金主题印象系列周边全线上架（衬衫、马甲、胸针、手表等）' },
      { date: '2025.06.09', title: '指尖键帽系列第二弹', desc: '砂金Q萌个性键帽公仔上线' },
    ],
  },
  strength: {
    guidesTitle: '配队/光锥/遗器攻略',
    compareTitle: '同角色强度对比',
    teamBuilds: [],
    relicSets: [],
    compareData: [],
    comments: [],
    eidolonData: [
      { level: 0, title: 'E0', desc: '砂金基础形态。战技提供护盾，终结技对敌方全体造成虚数属性伤害并施加易损效果。普攻概率为自身提供护盾。', rating: 'S', improvement: 0 },
      { level: 1, title: 'E1', desc: '砂金施放终结技时，额外恢复10点能量。护盾吸收量提升20%。', rating: 'S+', improvement: 25 },
      { level: 2, title: 'E2', desc: '砂金战技等级+2（最高15级），普攻等级+2（最高15级）。护盾破碎时对周围敌方造成一次等同于砂金防御力50%的虚数属性伤害。', rating: 'SS', improvement: 40 },
      { level: 3, title: 'E3', desc: '砂金终结技等级+2（最高15级），天赋等级+2（最高15级）。', rating: 'S+', improvement: 50 },
      { level: 4, title: 'E4', desc: '砂金手持护盾时，受到的伤害额外降低15%。护盾刷新时，恢复5%最大生命值。', rating: 'SS', improvement: 65 },
      { level: 5, title: 'E5', desc: '砂金普攻等级+1（最高10级），战技等级+1（最高10级）。护盾量提升30%。', rating: 'SS+', improvement: 80 },
      { level: 6, title: 'E6', desc: '砂金护盾量提升50%。手中持有护盾时，普攻、战技、终结技造成的伤害提升35%。施放战技时有50%概率不消耗战技点。', rating: 'SSS', improvement: 100 },
    ],
    characterList: [
      '砂金', '开拓者（存护）', '开拓者（同谐）', '阿兰', '爱丝妲', '白露', '黑塔', '停云', '桂乃芬', '寒鸦', '景元', '卡芙卡', '流萤', '逻格斯', '罗刹', '阮·梅', '砂金', '银狼', '知更鸟', '黄泉',
    ],
  },
  blackMud: {
    pageTitle: '黑泥区 - 理性吐槽',
    warningText: '本区为理性讨论板块。禁止人身攻击、辱骂角色及制作组。如有严重违规行为，管理员将删除相关留言。',
    requireVerify: true,
  },
  submit: {
    newsTitle: '最新动态投稿',
    photoTitle: '线下应援实拍投稿',
    updateTitle: '板块内容更新投稿',
    guidelines: '投稿须知：① 请确保内容真实有效 ② 审核通过后将展示于对应板块 ③ 恶意虚假信息将被拒稿 ④ 游客无需登录即可投稿 ⑤ 板块更新需注明修改理由',
  },
  blessings: {
    pageTitle: '祝福区 - 愿极光照亮你的旅途',
    subtitle: '写下你想对砂金说的话，每一条祝福都是一片极光',
  },
  supportRecord: {
    pageTitle: '眠于金色夏夜的过往 · 应援记录',
    records: [
      { date: '2024.03', title: '砂金首发UP池应援', location: '上海', desc: '首发UP池期间，上海人民广场地铁站大屏应援投放', image: '', tag: '线下' },
    ],
  },
  theme: {
    primaryColor: '#d4b878',
    secondaryColor: '#c4a868',
    backgroundColor: '#0a0a0a',
    cardStyle: 'glass',
    fontSize: 'medium',
    borderRadius: 12,
  },
};

function loadContent(): SiteContent {
  try {
    const raw = localStorage.getItem('aventurine_site_content')
    if (raw) {
      const saved = JSON.parse(raw) as Partial<SiteContent>
      return deepMerge(defaultContent, saved)
    }
  } catch { /* ignore */ }
  return defaultContent
}

function deepMerge<T extends Record<string, unknown>>(base: T, override: Partial<T>): T {
  const result = { ...base }
  for (const key of Object.keys(override) as (keyof T)[]) {
    const ov = override[key]
    const bv = base[key]
    if (ov !== undefined && ov !== null) {
      if (typeof ov === 'object' && !Array.isArray(ov) && typeof bv === 'object' && !Array.isArray(bv)) {
        ;(result as Record<string, unknown>)[key as string] = deepMerge(bv as Record<string, unknown>, ov as Record<string, unknown>)
      } else {
        ;(result as Record<string, unknown>)[key as string] = ov
      }
    }
  }
  return result
}

interface ContentContextValue {
  content: SiteContent;
  updateContent: (path: string, value: unknown) => void;
  resetContent: () => void;
  isDirty: boolean;
}

const ContentCtx = createContext<ContentContextValue | null>(null)

export function ContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<SiteContent>(loadContent)
  const [isDirty, setIsDirty] = useState(false)

  useEffect(() => {
    const raw = localStorage.getItem('aventurine_site_content')
    setIsDirty(raw !== null)
  }, [])

  const saveContent = useCallback((newContent: SiteContent) => {
    const diff = getDiff(defaultContent, newContent)
    if (Object.keys(diff).length === 0) {
      localStorage.removeItem('aventurine_site_content')
      setIsDirty(false)
    } else {
      localStorage.setItem('aventurine_site_content', JSON.stringify(diff))
      setIsDirty(true)
    }
  }, [])

  const updateContent = useCallback((path: string, value: unknown) => {
    setContent(prev => {
      const next = structuredClone(prev)
      setByPath(next, path, value)
      saveContent(next)
      return next
    })
  }, [saveContent])

  const resetContent = useCallback(() => {
    setContent(structuredClone(defaultContent))
    localStorage.removeItem('aventurine_site_content')
    setIsDirty(false)
  }, [])

  return (
    <ContentCtx.Provider value={{ content, updateContent, resetContent, isDirty }}>
      {children}
    </ContentCtx.Provider>
  )
}

export function useContent() {
  const ctx = useContext(ContentCtx)
  if (!ctx) throw new Error('useContent must be used within ContentProvider')
  return ctx
}

function getDiff(base: Record<string, unknown>, current: Record<string, unknown>): Record<string, unknown> {
  const diff: Record<string, unknown> = {}
  for (const key of Object.keys(current)) {
    const cv = current[key]
    const bv = base[key]
    if (cv === undefined || cv === null) continue
    if (bv === undefined) { diff[key] = cv; continue }
    if (Array.isArray(cv) && Array.isArray(bv)) {
      if (JSON.stringify(cv) !== JSON.stringify(bv)) diff[key] = cv
    } else if (typeof cv === 'object' && typeof bv === 'object') {
      const sub = getDiff(bv as Record<string, unknown>, cv as Record<string, unknown>)
      if (Object.keys(sub).length > 0) diff[key] = sub
    } else if (cv !== bv) {
      diff[key] = cv
    }
  }
  return diff
}

function setByPath(obj: Record<string, unknown>, path: string, value: unknown) {
  const keys = path.split('.')
  let current = obj
  for (let i = 0; i < keys.length - 1; i++) {
    if (!(keys[i] in current)) (current as Record<string, unknown>)[keys[i]] = {}
    current = (current as Record<string, unknown>)[keys[i]] as Record<string, unknown>
  }
  ;(current as Record<string, unknown>)[keys[keys.length - 1]] = value
}

export { defaultContent }
