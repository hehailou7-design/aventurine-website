import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import type { ReactNode } from 'react'
import type { PageBuilderData } from '../types/pageBuilder'
import { preparePublishContent, downloadContentJson, publishToGitHub } from '../lib/github-publish'

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
  /** 详情页长描述（可选，为空时使用 desc） */
  detailDesc?: string;
  /** 详情页额外图片（可选） */
  detailImages?: string[];
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
  taobaoUrl?: string;
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

export interface CharacterEidolon {
  level: number;
  name_zh: string;
  name_en: string;
  desc_zh: string;
  desc_en: string;
  icon: string;
}

export interface CharacterTrace {
  key: string;
  name_zh: string;
  name_en: string;
  desc_zh: string;
  desc_en: string;
  unlockCondition: string;
  icon: string;
}

export interface CharacterStory {
  level: number;
  title_zh: string;
  title_en: string;
  body_zh: string;
  body_en: string;
}

export interface Blessing {
  id: string;
  name: string;
  text: string;
  time: string;
  likes: number;
}

export interface SupportScreen {
  address: string;
  deadline: string;
  unlockCondition: string;
  link: string;
  city?: string;
}

export interface SupportMapMarker {
  id: string;
  city: string;
  title: string;
  lat: number;
  lng: number;
  desc: string;
}

export interface CalendarEvent {
  id: string;
  date: string; // MM-DD
  title: string;
  desc: string;
  sticker: string; // emoji animal
}

export interface SandKnowledge {
  id: string;
  text: string;
  source?: string;
  submittedBy?: string;
}

export interface GachaQuote {
  id: string;
  text: string;
  rarity: 'SR' | 'SSR' | 'UR';
}

export interface MaterialTableItem {
  date: string; // YYYY-MM-DD or just MM-DD
  title: string;
  image: string;
  link: string;
  tag: string;
}

export interface FeedbackItem {
  id: string;
  nickname: string;
  email?: string;
  content: string;
  rating?: number;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  reviewNote?: string;
}

export interface SponsorshipApplication {
  id: string;
  nickname: string;
  contact: string;
  experience: string;
  contribution: string;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  reviewNote?: string;
}

export interface ContentUpdateSubmission {
  id: string;
  nickname: string;
  section: string;
  field?: string;
  oldValue: string;
  newValue: string;
  reason: string;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  reviewNote?: string;
}

export interface CharacterVoice {
  trigger: string;
  text_zh: string;
  text_en: string;
}

export interface CharacterProfileField {
  id: string;
  label: string;
  value: string;
  type?: 'text' | 'image';
  image?: string;
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

export interface SiteConfig {
  siteTitle: string;
  siteSubtitle: string;
  logoUrl: string;
  headerImage: string;
  favicon: string;
  /** JSONBin.io API Key（发布到全站后所有用户共用） */
  jsonBinApiKey?: string;
  /** JSONBin.io Bin ID（发布到全站后所有用户共用） */
  jsonBinBinId?: string;
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
    accountPassword: string;
    adminNickname: string;
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
    items: Blessing[];
  };
  supportRecord: {
    pageTitle: string;
    records: { date: string; title: string; location: string; city: string; lat: number; lng: number; desc: string; image: string; tag: string; howToJoin: string }[];
    year2024Summary: string;
    year2025Summary: string;
    year2026Summary: string;
    screens: SupportScreen[];
    mapMarkers2024: SupportMapMarker[];
    mapMarkers2025: SupportMapMarker[];
    mapMarkers2026: SupportMapMarker[];
  };
  events: {
    mysteryDesc: Record<string, string>;
    hangzhouDesc: Record<string, string>;
    groups: {
      weibo: string;
      douyin: string;
      qq: string;
      xiaohongshu: string;
      wechat: string;
    };
  };
  sashaSay: {
    pageTitle: string;
    subtitle: string;
    knowledge: SandKnowledge[];
    gachaQuotes: GachaQuote[];
    gachaTitle: string;
  };
  calendar: {
    events: CalendarEvent[];
  };
  countdown: {
    birthday: string;
    debutDate: string;
  };
  materialTable: {
    year2024: MaterialTableItem[];
    year2025: MaterialTableItem[];
    year2026: MaterialTableItem[];
  };
  theme: {
    primaryColor: string;
    secondaryColor: string;
    backgroundColor: string;
    cardStyle: 'glass' | 'solid' | 'gradient';
    fontSize: 'small' | 'medium' | 'large';
    borderRadius: number;
  };
  siteConfig: SiteConfig;
  pageBuilder?: PageBuilderData;
}

const defaultContent: SiteContent = {
  home: {
    bannerSlides: [
      { tagline: '世界的一次性赌注 · 从不食言的赌徒', subtitle: '我们终将在卡卡瓦的极光下重逢', accent: '#d4b878', image: '' },
      { tagline: 'IPC战略投资部长 · 匹诺康尼来客', subtitle: '所有的命运都是早已注定的赌局', accent: '#b0a0d8', image: '' },
      { tagline: '亲爱的，你输定了 · 但是与我共赴盛宴', subtitle: '砂金·Aventurine 全球粉丝应援', accent: '#9cba8a', image: '' },
    ],
    navCards: [
      { key: 'character', icon: '◆', label: '角色设定', desc: '档案·剧情·台词·考据', color: '#d4b878' },
      { key: 'materials', icon: '◇', label: '角色物料', desc: '官方原画·应援印刷品', color: '#c4a868' },
      { key: 'collaboration', icon: '★', label: '官方联动', desc: '联名门店·周边图鉴', color: '#d4b878' },
      { key: 'chronicle', icon: '◈', label: '角色编年史', desc: '时间轴·大事记', color: '#9cba8a' },
      { key: 'blackmud', icon: '◉', label: '黑泥区', desc: '理性吐槽·有话好说', color: '#888' },
      { key: 'submit', icon: '✉', label: '投稿区', desc: '最新动态·线下实拍·板块更新', color: '#b0a0d8' },
      { key: 'supportRecord', icon: '🎂', label: '生贺应援', desc: '线下应援·生贺记录', color: '#d4b878' },
      { key: 'sashaSay', icon: '🗣️', label: '砂砂想说', desc: '冷知识·扭蛋预言', color: '#e898b8' },
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
  siteConfig: {
    siteTitle: '砂金全球应援站',
    siteSubtitle: '我们终将在卡卡瓦的极光下重逢',
    logoUrl: '',
    headerImage: '',
    favicon: '',
    jsonBinApiKey: '',
    jsonBinBinId: '',
  },
  character: {
    intro: '砂金 Aventurine — 崩坏：星穹铁道 · 五星角色 · 虚数属性 · 存护命途',
    characterArt: '/images/wiki/character_art.png',
    basicInfo: {
      nameZh: '砂金', nameEn: 'Aventurine', rarity: 5, path: '存护', element: '虚数',
      faction: '星际和平公司 · 石心十人', world: '茨冈尼亚-Ⅳ', gender: '男', birthday: '未知',
      cvZh: '杨超然', cvEn: 'Camden Sutkowski', cvJp: '河西健吾', cvKo: '박준원',
    },
    profileBoxes: [
      {
        id: 'basic-info', title: '基本信息', layout: 'grid' as const, titleColor: '#d4b878', titleFontSize: 12,
        background: 'rgba(212,184,120,0.05)', border: '1px solid rgba(212,184,120,0.15)', borderRadius: 10,
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
        id: 'detail-info', title: '详细信息', layout: 'list' as const, titleColor: '#d4b878', titleFontSize: 12,
        background: 'rgba(212,184,120,0.05)', border: '1px solid rgba(212,184,120,0.15)', borderRadius: 10,
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
        id: 'cv-info', title: '声优信息', layout: 'list' as const, titleColor: '#d4b878', titleFontSize: 12,
        background: 'rgba(212,184,120,0.05)', border: '1px solid rgba(212,184,120,0.15)', borderRadius: 10,
        fields: [
          { id: 'f20', label: 'CV（中）', value: '杨超然', labelColor: 'rgba(242,232,208,0.9)', valueColor: 'rgba(242,232,208,0.9)', fontSize: 13, fontWeight: 'normal', fontStyle: 'normal', textAlign: 'left' },
          { id: 'f21', label: 'CV（日）', value: '河西健吾', labelColor: 'rgba(242,232,208,0.9)', valueColor: 'rgba(242,232,208,0.9)', fontSize: 13, fontWeight: 'normal', fontStyle: 'normal', textAlign: 'left' },
          { id: 'f22', label: 'CV（英）', value: 'Camden Sutkowski', labelColor: 'rgba(242,232,208,0.9)', valueColor: 'rgba(242,232,208,0.9)', fontSize: 13, fontWeight: 'normal', fontStyle: 'normal', textAlign: 'left' },
          { id: 'f23', label: 'CV（韩）', value: '박준원', labelColor: 'rgba(242,232,208,0.9)', valueColor: 'rgba(242,232,208,0.9)', fontSize: 13, fontWeight: 'normal', fontStyle: 'normal', textAlign: 'left' },
        ],
      },
    ],
    skills: [
      { key: 'basic', name_zh: '直观投注', name_en: 'Straight Bet', type: 'basic', energyGen: 20,
        desc_zh: '对指定敌方单体造成等同于砂金50%防御力的虚数属性伤害。',
        desc_en: "Deals Imaginary DMG equal to 50% of Aventurine's DEF to a single enemy.",
        icon: '/images/wiki/skill_basic.png' },
    ],
    eidolons: [], traces: [], stories: [], voices: [],
    tabs: { profile: '...', story: '...', voice: '...', research: '...' },
  },
  materials: {
    officialTitle: '官方原画', offlineTitle: '物料整理',
    official: [
      { title: '砂金官方立绘（横版）', desc: '崩坏：星穹铁道官方立绘，横版全身', tag: '立绘', image: '', date: '2024.02.28', link: 'https://www.miyoushe.com/sr/article/50218448', clickAction: 'link', detailDesc: '这是崩坏：星穹铁道官方发布的砂金横版全身立绘。砂金身着标志性的金色与黑色礼服，手持硬币道具，展现了角色从容不迫的赌徒气质。该立绘于2024年2月28日首次公开，是砂金角色的正式亮相形象。点击"查看原图"可跳转至米游社官方文章查看高清大图。' },
      { title: '砂金官方立绘（竖版）', desc: '崩坏：星穹铁道官方立绘，竖版全身', tag: '立绘', image: '', date: '2024.02.28', clickAction: 'none', detailDesc: '砂金竖版官方立绘，与横版同日发布。竖版构图更突出角色的身高与气场，适合作为手机壁纸使用。砂金的精致服饰细节在这张立绘中得以充分展现——从胸前的领巾到腰间的装饰链，每一处都体现了米哈游的美术功底。' },
      { title: '砂金透明底立绘', desc: '官方透明背景立绘', tag: '立绘', image: '', date: '2024.03.01', clickAction: 'none', detailDesc: '砂金透明背景立绘，去除了游戏内背景，仅保留角色本体。透明底素材非常适合用于二创、表情包制作、周边设计等场景。该版本于2024年3月1日放出，方便同人创作者使用。' },
      { title: '2.1版本PV「狂热奔向深渊」', desc: '砂金角色PV「金手指」，官方完整版', tag: 'PV', image: '', date: '2024.03.15', link: 'https://www.bilibili.com/video/BV12x421m7K9', clickAction: 'video', detailDesc: '砂金正式亮相的2.1版本PV「狂热奔向深渊」。影片中砂金以压倒性的存在感登场，展示了其操纵概率、运筹帷幄的核心魅力。PV配乐极具张力，镜头语言充满戏剧性，完美诠释了砂金"赌上一切"的角色主题。点击播放按钮跳转B站观看完整版。' },
      { title: '砂金官图自存（第一弹）', desc: '官方宣传图集合', tag: '宣传图', image: '', date: '2024.03.09', link: 'https://www.miyoushe.com/sr/article/50129960', clickAction: 'link', detailDesc: '官方发布的第一弹砂金宣传图合集包含多张不同场景、不同表情的砂金图片：战斗姿态、休闲日常、Q版表情包等。这些图片广泛用于粉丝社群传播和应援物料制作。点击链接查看米游社完整图集。' },
      { title: '砂金官图自存（第二弹）', desc: '更多官方宣传图', tag: '宣传图', image: '', date: '2024.03.12', link: 'https://www.miyoushe.com/sr/article/50218448', clickAction: 'link', detailDesc: '官方第二弹砂金宣传图合集在第一弹基础上补充了更多素材，包括砂金与匹诺康尼场景的互动图、角色细节特写等。适合作为深入了解角色视觉设计的参考。' },
      { title: '214情人节特别电影宣传图', desc: '情人节特别活动宣传', tag: '宣传图', image: '', date: '2024.02.14', clickAction: 'none', detailDesc: '2024年情人节特别发布的砂金宣传图，这也是砂金角色的首次公开曝光。图中砂金手捧玫瑰，背景是浪漫的金色粒子效果，以"赌上我的心"为主题，引发了玩家社区的广泛讨论和期待。' },
      { title: '砂金anan杂志封面', desc: '日本anan杂志封面，砂金主题', tag: '杂志', image: '', date: '2024.03.20', clickAction: 'none', detailDesc: '砂金登上日本知名杂志anan封面，彰显了角色在海外市场的影响力。杂志封面采用砂金的标志性金色调，搭配时尚感的版式设计，将游戏角色与时尚杂志美学完美融合。' },
      { title: '英推嘉年华宣图', desc: '英国Twitter嘉年华活动宣传图', tag: '宣传图', image: '', date: '2024.04.01', clickAction: 'none', detailDesc: '崩坏星穹铁道英国Twitter官方账号发布的嘉年华活动宣传图，砂金作为核心角色亮相。该宣传图面向海外粉丝群体，设计风格融合了英伦元素与原有的角色美学。' },
      { title: '砂金壁纸高清无水印（第一弹）', desc: '高清壁纸收藏集第一弹', tag: '壁纸', image: '', date: '2024.05.04', link: 'https://www.miyoushe.com/sr/article/52420580', clickAction: 'link', detailDesc: '官方整理的高清无水印砂金壁纸合集第一弹，包含多种分辨率适配不同设备（手机、平板、桌面）。壁纸以砂金的经典造型为基础，配以匹诺康尼的金色背景，展现角色高贵优雅的气质。' },
      { title: '砂金壁纸高清无水印（第二弹）', desc: '高清壁纸收藏集第二弹', tag: '壁纸', image: '', date: '2024.05.25', clickAction: 'none', detailDesc: '高清壁纸合集第二弹，在第一弹基础上增加了更多场景和构图。包含砂金的战斗场景截图、角色界面立绘的高清版本等。' },
    ],
    offline: [
      { title: '茶百道联动联名吊牌', desc: '崩铁X茶百道联动，可固定联名吊牌', tag: '联动', image: '', date: '2024.04.26', clickAction: 'none', detailDesc: '崩坏：星穹铁道与茶百道联名活动的限定吊牌。砂金款吊牌采用金色为主色调，印有角色立绘和联名logo。吊牌可固定在包袋或钥匙扣上，是粉丝收藏的热门周边。活动期间在全国茶百道门店消费指定套餐即可获得。' },
      { title: '立绘系列亚克力立牌', desc: '官方立绘亚克力立牌', tag: '周边', image: '', date: '2024.09.01', clickAction: 'none', detailDesc: '以砂金官方立绘为主题的亚克力立牌。采用高清UV印刷工艺，色彩还原度高，立牌尺寸约15cm高。附带底座，可摆放在桌面、书架或展示柜中，是砂金推的必备桌面周边。' },
      { title: '主题印象系列 - 条纹衬衫', desc: '砂金主题印象系列，蓝绿/米黄两款', tag: '周边', image: '', date: '2025.03.20', clickAction: 'none', detailDesc: '米哈游"主题印象"系列服饰周边，以砂金的配色方案为设计灵感。衬衫提供蓝绿色和米黄色两种选择，袖口和领口内侧印有砂金的代表符号。材质为棉涤混纺，日常穿着舒适。' },
      { title: '主题印象系列 - 胸针', desc: '砂金主题印象系列胸针', tag: '周边', image: '', date: '2025.03.20', clickAction: 'none', detailDesc: '砂金主题印象系列胸针，采用金色电镀工艺，造型取自砂金服饰中的经典元素。胸针尺寸精致，可别在衣领、背包或帽子等位置，低调展现对角色的喜爱。' },
      { title: '主题印象系列 - 戒指套装', desc: '砂金主题印象系列戒指', tag: '周边', image: '', date: '2025.03.20', clickAction: 'none', detailDesc: '砂金主题印象系列戒指套装，包含多款设计，灵感来源于砂金在游戏中佩戴的戒指和手部装饰。采用合金材质，部分款式镶嵌人造宝石。适合日常佩戴或收藏展示。' },
      { title: '主题印象系列 - 手表', desc: '砂金主题印象系列手表，399元', tag: '周边', image: '', date: '2025.03.20', clickAction: 'none', detailDesc: '主题印象系列中最具代表性的单品——砂金主题手表，售价399元。表盘设计融入了砂金的视觉元素，表带印有角色logo。石英机芯，日常防水，兼具实用性与收藏价值。' },
      { title: '叽米的会客室 - 迷你马口铁徽章', desc: '砂金迷你马口铁徽章', tag: '周边', image: '', date: '2024.06.01', clickAction: 'none', detailDesc: '"叽米的会客室"系列周边中的砂金款迷你马口铁徽章。直径约5cm，采用马口铁材质，表面覆有保护膜。图案为砂金的Q版造型，可爱又精致，可以别在背包、痛包或itabag上展示。' },
      { title: '叽米的会客室 - 毛绒玩偶挂件', desc: '砂金毛绒玩偶挂件/摆件/公仔', tag: '周边', image: '', date: '2024.06.01', clickAction: 'none', detailDesc: '砂金Q版毛绒玩偶挂件，约12cm高。采用柔软的短毛绒面料，填充饱满，手感极佳。头顶有挂绳设计，可挂在包上作为挂件，也可以作为桌面摆件。砂金的标志性金色头发和服饰细节都做了还原。' },
      { title: '无名客的奖章 - 亚克力印章摆件', desc: '砂金亚克力印章摆件', tag: '周边', image: '', date: '2024.07.01', clickAction: 'none', detailDesc: '"无名客的奖章"系列砂金款亚克力印章摆件。透明亚克力材质，底座内置印章功能，可以印出砂金的代表图案。摆件整体设计精美，兼具装饰性和实用性。' },
      { title: 'GSC砂金粘土人手办', desc: '良笑社砂金粘土人手办', tag: '手办', image: '', date: '2025.03.15', clickAction: 'none', detailDesc: '由Good Smile Company（良笑社）出品的砂金粘土人手办（Nendoroid）。约10cm高，附带多种表情零件和手部配件，可自由更换摆出不同的姿势。包含砂金的硬币道具和专属底座。粘土人系列以Q版造型和可动性著称，是手办收藏的热门系列。' },
      { title: '崩铁X中信联动借记卡（砂金卡面）', desc: '中信银行崩铁联动借记卡，砂金卡面', tag: '联动', image: '', date: '2024.09.01', clickAction: 'none', detailDesc: '中信银行与崩坏：星穹铁道联名推出的借记卡，提供砂金专属卡面可选。卡面以金色为主色调，印有砂金立绘。持卡可享受中信银行的基础金融服务，是砂金粉丝的身份象征。' },
      { title: '指尖键帽系列第二弹（砂金）', desc: '砂金Q萌个性键帽公仔', tag: '周边', image: '', date: '2025.06.09', clickAction: 'none', detailDesc: '"指尖键帽"系列第二弹的砂金款键帽公仔。Q版砂金造型搭配机械键盘键帽底座，可以安装在Cherry MX轴体的机械键盘上。既是实用的键帽替换件，也是桌面的可爱装饰。' },
    ],
  },
  collaboration: {
    storesTitle: '联名合作门店', merchTitle: '官方周边图鉴',
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
    guidesTitle: '配队/光锥/遗器攻略', compareTitle: '同角色强度对比',
    teamBuilds: [], relicSets: [], compareData: [], comments: [],
    eidolonData: [
      { level: 0, title: 'E0', desc: '砂金基础形态。战技提供护盾，终结技对敌方全体造成虚数属性伤害并施加易损效果。普攻概率为自身提供护盾。', rating: 'S', improvement: 0 },
      { level: 1, title: 'E1', desc: '砂金施放终结技时，额外恢复10点能量。护盾吸收量提升20%。', rating: 'S+', improvement: 25 },
      { level: 2, title: 'E2', desc: '砂金战技等级+2（最高15级），普攻等级+2（最高15级）。护盾破碎时对周围敌方造成一次等同于砂金防御力50%的虚数属性伤害。', rating: 'SS', improvement: 40 },
      { level: 3, title: 'E3', desc: '砂金终结技等级+2（最高15级），天赋等级+2（最高15级）。', rating: 'S+', improvement: 50 },
      { level: 4, title: 'E4', desc: '砂金手持护盾时，受到的伤害额外降低15%。护盾刷新时，恢复5%最大生命值。', rating: 'SS', improvement: 65 },
      { level: 5, title: 'E5', desc: '砂金普攻等级+1（最高10级），战技等级+1（最高10级）。护盾量提升30%。', rating: 'SS+', improvement: 80 },
      { level: 6, title: 'E6', desc: '砂金护盾量提升50%。手中持有护盾时，普攻、战技、终结技造成的伤害提升35%。施放战技时有50%概率不消耗战技点。', rating: 'SSS', improvement: 100 },
    ],
    characterList: ['砂金', '开拓者（存护）', '开拓者（同谐）', '阿兰', '爱丝妲', '白露', '黑塔', '停云', '桂乃芬', '寒鸦', '景元', '卡芙卡', '流萤', '逻格斯', '罗刹', '阮·梅', '砂金', '银狼', '知更鸟', '黄泉'],
  },
  blackMud: { pageTitle: '黑泥区 - 理性吐槽', warningText: '本区为理性讨论板块。禁止人身攻击、辱骂角色及制作组。如有严重违规行为，管理员将删除相关留言。', requireVerify: true, accountPassword: 'aventurine2024', adminNickname: '管理员' },
  submit: { newsTitle: '最新动态投稿', photoTitle: '线下应援实拍投稿', updateTitle: '板块内容更新投稿', guidelines: '投稿须知：① 请确保内容真实有效 ② 审核通过后将展示于对应板块 ③ 恶意虚假信息将被拒稿 ④ 游客无需登录即可投稿 ⑤ 板块更新需注明修改理由' },
  blessings: { pageTitle: '祝福区 - 愿极光照亮你的旅途', subtitle: '写下你想对砂金说的话，每一条祝福都是一片极光', items: [] },
  supportRecord: {
    pageTitle: '眠于金色夏夜的过往 · 生贺应援',
    year2024Summary: '✦ 砂金正式上线\n✦ 首日流水登顶全服\n✦ 茶百道联动\n✦ 中信银行联动借记卡\n✦ 叽米的会客室系列\n✦ 无名客的奖章系列\n\n砂金角色的第一年，从正式上线到成为崩铁人气角色，粉丝应援开始萌芽。',
    year2025Summary: `✦ 60城百屏\n✦ 240+棒超长产出接龙\n✦ 11城线下咖啡应援\n✦ 24城线下打卡活动\n✦ 5城生咖\n✦ 线下大型生日会\n✦ 线上生日会\n✦ 重庆痛楼\n✦ 星星命名\n✦ 多平台联动等更多活动\n\n携手200多位产出老师及多城线下共同庆祝砂金4.17入池一周年。与此同时等待着即将在5月5日立夏到来的卡卡瓦日。`,
    year2026Summary: `崩坏星穹铁道距今为止最大规模/最多城市数/最多活动数/最多屏数的民办单人应援企划，每项活动均为崩铁ip同人活动的最大规模。我们今年将在北上广深等114个城市展开线下活动并且投屏2w+的电子屏，更有灯光秀/喷泉秀/双城摩天轮/超跑应援/宇宙传讯发射/280+小时超长产出合绘/砂金二创电影节等庆生项目\n\n我们希望并期待着能在未来看到砂金的更多可能。\n\n●百城万屏单人大屏Live2d应援【100城20000+屏】\n●百城线下活动【114城】\n●30城咖啡应援【线下30城快闪+无料发放】\n●17城生咖【线下16城无料发放+线下聚会】\n●19城痛楼【线下19城痛楼+无料发放】\n●产出接龙270+小时持续30天\n●双城摩天轮应援\n●喷泉痛泉应援\n●超跑应援超前预告\n●宇宙深空传讯发射\n●砂金二创电影节\n●楼体灯光秀\n●武汉亲橙万象汇痛楼\n●烤匠麻辣烤鱼x砂金生贺组三城联动\n●集研会x砂金生贺组联动\n●次元汇x砂金生贺组联动\n●交易猫x砂金生贺组联动\n●交易猫x砂金同人主页防诈公益小短片\n●千岛特别联动\n●生贺头像+版头解锁\n更多内容敬请期待...\n\n主催/核管：二生\n主办：砂金右向同人主页/砂金生贺组/砂金同人主页\n策划：二生/幸陨/谢却荼蘼/停停/章鱼\n美工：我什么时候退休/阡陌momo/二生/奈川早月/这里已经没有正常人了\n免屏组：执花厨/二生/宝宝奴/鹊酒/花月/小喵砂/江柯/小春/all beauty/松鼠\n线上生日会主催：章鱼\n产出接龙主催：酒茨`,
    screens: [
      { address: '上海IFC商圈LED大屏', deadline: '2026-05-05', unlockCondition: '应援人数达500人', link: 'https://example.com/sh-ifc', city: '上海' },
      { address: '北京三里屯太古里', deadline: '2026-05-05', unlockCondition: '应援人数达300人', link: 'https://example.com/bj-slt', city: '北京' },
      { address: '广州天河城', deadline: '2026-05-05', unlockCondition: '应援人数达200人', link: 'https://example.com/gz-thc', city: '广州' },
      { address: '成都IFS熊猫屏', deadline: '2026-05-05', unlockCondition: '应援人数达400人', link: 'https://example.com/cd-ifs', city: '成都' },
      { address: '长沙IFS', deadline: '2026-05-05', unlockCondition: '应援人数达250人', link: 'https://example.com/cs-ifs', city: '长沙' },
      { address: '双城摩天轮灯光秀', deadline: '2026-05-05', unlockCondition: '应援人数达1000人', link: 'https://example.com/ferris-wheel', city: '长沙/南昌' },
    ],
    mapMarkers2024: [
      { id: 'm2024-1', city: '上海', title: '茶百道联名·上海站', lat: 31.2304, lng: 121.4737, desc: '崩铁X茶百道联名活动' },
      { id: 'm2024-2', city: '广州', title: '叽米的会客室首发', lat: 23.1291, lng: 113.2644, desc: '砂金周边首次线下发售' },
      { id: 'm2024-3', city: '北京', title: '中信联动卡首发', lat: 39.9042, lng: 116.4074, desc: '中信银行崩铁联动借记卡砂金卡面首发' },
    ],
    mapMarkers2025: [
      { id: 'm2025-1', city: '上海', title: '一周年·大型生日会', lat: 31.2304, lng: 121.4737, desc: '砂金线下大型生日会' },
      { id: 'm2025-2', city: '重庆', title: '一周年·重庆痛楼', lat: 29.5630, lng: 106.5516, desc: '解放碑商圈电梯楼整栋应援' },
      { id: 'm2025-3', city: '广州', title: '一周年·生咖', lat: 23.1291, lng: 113.2644, desc: '五城生咖之一' },
      { id: 'm2025-4', city: '成都', title: '一周年·生咖+咖啡', lat: 30.5728, lng: 104.0668, desc: '咖啡应援+生咖双重活动' },
      { id: 'm2025-5', city: '杭州', title: '一周年·生咖', lat: 30.2741, lng: 120.1551, desc: '西湖畔线下聚会' },
    ],
    mapMarkers2026: [
      { id: 'm2026-1', city: '上海', title: '二周年·超跑应援', lat: 31.3389, lng: 121.2256, desc: '砂金主题超跑车队' },
      { id: 'm2026-2', city: '北京', title: '二周年·百城万屏', lat: 39.9042, lng: 116.4074, desc: '20000+电子屏Live2d应援' },
      { id: 'm2026-3', city: '长沙', title: '二周年·摩天轮', lat: 28.2282, lng: 112.9388, desc: '砂金主题灯光应援' },
      { id: 'm2026-4', city: '武汉', title: '二周年·痛楼', lat: 30.5928, lng: 114.3055, desc: '亲橙万象汇砂金痛楼' },
      { id: 'm2026-5', city: '酒泉', title: '二周年·宇宙传讯', lat: 40.9600, lng: 100.2900, desc: '向宇宙深空发射传讯' },
      { id: 'm2026-6', city: '成都', title: '二周年·烤匠联动', lat: 30.5728, lng: 104.0668, desc: '烤匠麻辣烤鱼三城联动' },
    ],
    records: [
      // 2025 一周年
      { date: '2025.04.17', title: '一周年生贺·60城百屏联动', location: '全国60+城市核心商圈大屏', city: '全国', lat: 35.8617, lng: 104.1954, desc: '砂金一周年60城百屏应援活动，覆盖全国各大城市核心商圈电子屏投放。', image: '', tag: '百屏', howToJoin: '关注砂金生贺组各平台账号获取最新大屏点位信息' },
      { date: '2025.04.17', title: '一周年·240+棒产出接龙', location: '各社交平台线上', city: '线上', lat: 0, lng: 0, desc: '240+棒超长产出接龙，200多位产出老师联合创作，跨越多个平台的同人创作盛宴。', image: '', tag: '产出', howToJoin: '通过微博/B站/小红书带#砂金一周年#话题参与产出接龙' },
      { date: '2025.05.05', title: '一周年·线下大型生日会', location: '上海世博展览馆', city: '上海', lat: 31.1867, lng: 121.4822, desc: '砂金线下大型生日会，粉丝欢聚一堂，共庆卡卡瓦日。包含互动游戏、抽奖、合影等环节。', image: '', tag: '生贺', howToJoin: '通过生贺组官方渠道报名，名额有限先到先得' },
      { date: '2025.05.05', title: '一周年·线上生日会', location: 'B站/抖音/微博 多平台直播', city: '线上', lat: 0, lng: 0, desc: '多平台同步直播的线上生日会，包含Cosplay、同人作品展示、生日祝福等环节。', image: '', tag: '生贺', howToJoin: '关注砂金生贺组B站/抖音官方账号，生日当天进入直播间' },
      { date: '2025.04-05', title: '一周年·11城线下咖啡应援', location: '上海/北京/广州/深圳/成都/杭州/南京/武汉/重庆/西安/苏州', city: '全国', lat: 30.5728, lng: 104.0668, desc: '11座城市线下咖啡店联名应援活动，提供砂金主题特调饮品及限定周边无料发放。', image: '', tag: '咖啡', howToJoin: '前往各城指定的联名咖啡店即可参与' },
      { date: '2025.04-05', title: '一周年·24城线下打卡活动', location: '全国24个城市', city: '全国', lat: 31.2304, lng: 121.4737, desc: '24座城市线下打卡活动，粉丝可在指定地点完成打卡任务获得限定周边。', image: '', tag: '线下', howToJoin: '关注生贺组发布的城市打卡地图，前往指定打卡点' },
      { date: '2025.05.05', title: '一周年·5城生咖', location: '广州/成都/杭州/武汉/南京', city: '全国', lat: 30.2741, lng: 120.1551, desc: '5座城市举办线下生咖聚会，含DIY无料手作、游戏互动、合影留念等活动。', image: '', tag: '生咖', howToJoin: '各城生咖组织者通过微博/QQ群发布参与方式' },
      { date: '2025.05.05', title: '一周年·重庆痛楼', location: '重庆解放碑商圈', city: '重庆', lat: 29.5630, lng: 106.5516, desc: '重庆市中心核心商圈电梯楼整栋应援，砂金主题装饰覆盖全楼。', image: '', tag: '痛楼', howToJoin: '前往重庆解放碑商圈即可打卡参观' },
      { date: '2025.05.05', title: '一周年·星星命名', location: '国际天文学联合会注册', city: '线上', lat: 0, lng: 0, desc: '为砂金命名了一颗真实的星星，注册于国际天文学联合会，包含纪念证书。', image: '', tag: '特别', howToJoin: '关注砂金生贺组公众号获取星星命名纪念信息' },
      // 2026 二周年
      { date: '2026.05.05', title: '二周年·百城万屏Live2d应援', location: '全国100个城市20000+电子屏', city: '全国', lat: 35.8617, lng: 104.1954, desc: '崩铁IP同人最大规模单人应援企划！100城20000+电子屏同时点亮，带Live2d动态效果的砂金单人应援投放。', image: '', tag: '百屏', howToJoin: '关注砂金生贺组各平台账号获取最新大屏点位信息' },
      { date: '2026.05.05', title: '二周年·114城线下活动', location: '北上广深等114个城市', city: '全国', lat: 39.9042, lng: 116.4074, desc: '114城线下应援活动全面铺开，覆盖全国绝大部分省会和重点城市。', image: '', tag: '线下', howToJoin: '在生贺组公布的114城中就近参与线下活动' },
      { date: '2026.05.05', title: '二周年·30城咖啡应援', location: '全国30城咖啡店快闪+无料发放', city: '全国', lat: 31.2304, lng: 121.4737, desc: '线下30城快闪咖啡应援，每城指定联名咖啡店提供砂金主题饮品及限定无料。', image: '', tag: '咖啡', howToJoin: '前往各城指定的联名咖啡店即可参与' },
      { date: '2026.05.05', title: '二周年·17城生咖', location: '线下16城无料发放+线下聚会', city: '全国', lat: 23.1291, lng: 113.2644, desc: '17座城市举办线下生咖聚会，16城可领取限定无料周边，享受同好交流时光。', image: '', tag: '生咖', howToJoin: '各城生咖组织者通过微博/QQ群发布参与方式' },
      { date: '2026.05.05', title: '二周年·19城痛楼', location: '全国19个城市痛楼+无料发放', city: '全国', lat: 30.5728, lng: 104.0668, desc: '19座城市核心商圈电梯楼整栋砂金主题应援，均有限定无料发放。', image: '', tag: '痛楼', howToJoin: '前往各城指定商圈即可打卡参观并领取无料' },
      { date: '2026.05.05', title: '二周年·270+小时产出接龙', location: '各社交平台线上持续30天', city: '线上', lat: 0, lng: 0, desc: '270+小时超长产出合绘接龙，持续30天不间断，史无前例的同人创作马拉松。', image: '', tag: '产出', howToJoin: '通过微博/B站/小红书带#砂金二周年#话题参与产出接龙' },
      { date: '2026.05.05', title: '二周年·双城摩天轮应援', location: '长沙/南昌 双城摩天轮', city: '全国', lat: 28.2282, lng: 112.9388, desc: '长沙、南昌双城摩天轮砂金主题灯光应援，摩天轮点亮砂金专属色彩。', image: '', tag: '特别', howToJoin: '前往长沙/南昌指定摩天轮即可观赏' },
      { date: '2026.05.05', title: '二周年·喷泉痛泉应援', location: '多个城市喷泉广场', city: '全国', lat: 31.2304, lng: 121.4737, desc: '多城喷泉广场定制砂金主题音乐喷泉秀，灯光+水幕+音乐联动。', image: '', tag: '特别', howToJoin: '关注生贺组公布的喷泉应援城市和具体时间' },
      { date: '2026.05.05', title: '二周年·超跑应援超前预告', location: '上海国际赛车场', city: '上海', lat: 31.3389, lng: 121.2256, desc: '砂金主题超跑应援活动超前预告，豪华超跑车队涂装砂金专属设计。', image: '', tag: '特别', howToJoin: '关注砂金生贺组后续公布的超跑应援详细安排' },
      { date: '2026.05.05', title: '二周年·宇宙深空传讯发射', location: '酒泉卫星发射中心', city: '酒泉', lat: 40.9600, lng: 100.2900, desc: '向宇宙深空发射砂金主题传讯信号，将卡卡瓦的祝福送往星辰大海。', image: '', tag: '特别', howToJoin: '关注砂金生贺组官方公告，获取发射直播观看方式' },
      { date: '2026.05.05', title: '二周年·砂金二创电影节', location: '线上投稿+线下展映', city: '上海', lat: 31.2304, lng: 121.4737, desc: '砂金主题二次创作电影节，征集粉丝制作的动画、MV、短片等，优秀作品线下展映。', image: '', tag: '特别', howToJoin: '通过生贺组官方渠道提交你的二创影片作品' },
      { date: '2026.05.05', title: '二周年·楼体灯光秀', location: '多个城市地标建筑', city: '全国', lat: 39.9042, lng: 116.4074, desc: '多城地标建筑激光投影灯光秀，砂金主题视觉盛宴点亮城市夜空。', image: '', tag: '特别', howToJoin: '关注生贺组公布的具体城市和楼体灯光秀时间' },
      { date: '2026.05.05', title: '二周年·武汉亲橙万象汇痛楼', location: '武汉亲橙万象汇', city: '武汉', lat: 30.5928, lng: 114.3055, desc: '武汉亲橙万象汇砂金主题痛楼应援，覆盖全楼砂金专属装饰。', image: '', tag: '痛楼', howToJoin: '前往武汉亲橙万象汇即可打卡参观' },
      { date: '2026.05.05', title: '二周年·烤匠麻辣烤鱼联动', location: '成都/重庆/西安 三城联动', city: '全国', lat: 30.5728, lng: 104.0668, desc: '烤匠麻辣烤鱼x砂金生贺组三城联动，推出砂金主题套餐及限定周边。', image: '', tag: '联动', howToJoin: '前往成都/重庆/西安指定烤匠门店即可参与' },
      { date: '2026.05.05', title: '二周年·交易猫联动', location: '交易猫APP平台', city: '线上', lat: 0, lng: 0, desc: '交易猫x砂金生贺组联动，含防诈公益小短片拍摄及千岛特别联动活动。', image: '', tag: '联动', howToJoin: '下载交易猫APP查看砂金主题专区' },
      { date: '2026.05.05', title: '二周年·生贺头像版头解锁', location: '微博超话/B站专题', city: '线上', lat: 0, lng: 0, desc: '砂金二周年限定头像+版头一键解锁，粉丝可更换专属砂金装扮。', image: '', tag: '特别', howToJoin: '在微博砂金超话或B站专题页面领取专属头像框' },
    ],
  },
  sashaSay: {
    pageTitle: '砂砂想说',
    subtitle: '关于砂金的趣味冷知识与名言预言',
    gachaTitle: '🎰 扭蛋预言',
    knowledge: [
      { id: 'k1', text: '砂金的真名是"卡卡瓦夏"（Kakavasha），这个名字在埃维金语中意为"被命运眷顾的孩子"。', source: '官方设定' },
      { id: 'k2', text: '砂金是"石心十人"中的一员，由IPC战略投资部直属。每位成员都以一种宝石命名。', source: '游戏剧情' },
      { id: 'k3', text: '砂金的命途是"存护"（Preservation），但他的战斗风格却充满攻击性。', source: '角色设定' },
      { id: 'k4', text: '砂金的生日是5月5日（立夏），立夏象征着生命的勃发。', source: '官方设定' },
      { id: 'k6', text: '砂金的CV阵容：中文杨超然、日文河西健吾、英文Camden Sutkowski、韩文朴俊元。', source: '官方公开' },
      { id: 'k7', text: '砂金的技能设计融入了赌场元素——战技"直观投注"，终结技"命运轮盘"。', source: '技能描述' },
      { id: 'k8', text: '砂金是崩铁中第一位"存护"命途的限定五星角色，开创了存护输出的新流派。', source: '游戏机制' },
      { id: 'k9', text: '砂金的标志性台词"所有命运都是早已注定的赌局"暗示了角色的核心理念。', source: '台词分析' },
      { id: 'k10', text: '砂金佩戴的多枚戒指各有含义，左手中指的戒指据推测代表了石心十人排位。', source: '角色考据' },
    ],
    gachaQuotes: [
      { id: 'g1', text: '「所有命运都是早已注定的赌局——但庄家，永远是我。」', rarity: 'UR' },
      { id: 'g2', text: '「亲爱的，你输定了。不过没关系，与我共赴这场盛宴吧。」', rarity: 'UR' },
      { id: 'g3', text: '「美丽的事物总是伴随着风险，这也是它们迷人的原因。」', rarity: 'SSR' },
      { id: 'g4', text: '「在卡卡瓦的极光下，我们终将重逢。」', rarity: 'SSR' },
      { id: 'g5', text: '「赌上一切的人，从来不会输。」', rarity: 'SSR' },
      { id: 'g6', text: '「运气？不，这是计算好的。」', rarity: 'SR' },
      { id: 'g7', text: '「IPC从不做亏本买卖——感情除外。」', rarity: 'SR' },
      { id: 'g8', text: '「每一枚硬币都有两面，正如每一个选择都有代价。」', rarity: 'SR' },
      { id: 'g9', text: '「你以为你在赌？其实你只是在帮我计算概率。」', rarity: 'SR' },
      { id: 'g10', text: '「存护不是防御，是让敌人后悔攻击的选择。」', rarity: 'SR' },
      { id: 'g11', text: '「我的戒指比你的未来更闪亮。」', rarity: 'SSR' },
      { id: 'g12', text: '「来，抛个硬币吧——反正结果都一样。」', rarity: 'SR' },
    ],
  },
  calendar: {
    events: [
      { id: 'c1', date: '02-14', title: '砂金首次曝光', desc: '2024年情人节特别宣传图', sticker: '🐱' },
      { id: 'c2', date: '02-28', title: '官方立绘发布', desc: '横版/竖版同日公开', sticker: '🐰' },
      { id: 'c3', date: '03-15', title: '2.1版本PV发布', desc: '「狂热奔向深渊」PV', sticker: '🦊' },
      { id: 'c4', date: '04-17', title: '砂金正式上线', desc: '入池日！2.1版本上线', sticker: '🐻' },
      { id: 'c5', date: '04-26', title: '茶百道联动', desc: '崩铁X茶百道联名开始', sticker: '🐼' },
      { id: 'c6', date: '05-05', title: '砂金生日/卡卡瓦日', desc: '立夏 · 生日快乐！', sticker: '🎂' },
      { id: 'c7', date: '06-01', title: '叽米的会客室', desc: '砂金徽章、毛绒玩偶上线', sticker: '🐣' },
      { id: 'c8', date: '09-01', title: '中信联动卡', desc: '崩铁X中信借记卡上线', sticker: '🐨' },
      { id: 'c9', date: '12-01', title: '砂金角色礼盒', desc: '砂金主题礼盒上线', sticker: '🎁' },
    ],
  },
  countdown: { birthday: '05-05', debutDate: '04-17' },
  materialTable: {
    year2024: [
      { date: '02-14', title: '情人节特别电影宣传图', image: '', link: '', tag: '宣传图' },
      { date: '02-28', title: '砂金官方立绘（横版）', image: '', link: '', tag: '立绘' },
      { date: '02-28', title: '砂金官方立绘（竖版）', image: '', link: '', tag: '立绘' },
      { date: '03-01', title: '砂金透明底立绘', image: '', link: '', tag: '立绘' },
      { date: '03-15', title: '2.1版本PV「狂热奔向深渊」', image: '', link: '', tag: 'PV' },
      { date: '03-20', title: '砂金anan杂志封面', image: '', link: '', tag: '杂志' },
      { date: '04-26', title: '茶百道联动联名吊牌', image: '', link: '', tag: '联动' },
      { date: '06-01', title: '叽米的会客室 · 迷你马口铁徽章', image: '', link: '', tag: '周边' },
      { date: '09-01', title: '崩铁X中信联动借记卡（砂金卡面）', image: '', link: '', tag: '联动' },
    ],
    year2025: [
      { date: '03-15', title: 'GSC砂金粘土人手办', image: '', link: '', tag: '手办' },
      { date: '03-20', title: '主题印象系列 · 条纹衬衫', image: '', link: '', tag: '周边' },
      { date: '03-20', title: '主题印象系列 · 手表', image: '', link: '', tag: '周边' },
      { date: '06-09', title: '指尖键帽系列第二弹（砂金）', image: '', link: '', tag: '周边' },
    ],
    year2026: [
      { date: '05-05', title: '二周年·百城万屏Live2d应援', image: '', link: '', tag: '应援' },
      { date: '05-05', title: '二周年·双城摩天轮应援', image: '', link: '', tag: '特别' },
      { date: '05-05', title: '二周年·宇宙深空传讯发射', image: '', link: '', tag: '特别' },
    ],
  },
  events: {
    mysteryDesc: { zh: '神秘企划正在建设中，敬请期待...', en: 'Mystery project under construction, stay tuned...', ja: 'ミステリープロジェクト建設中、お楽しみに...', ko: '미스터리 프로젝트 건설 중, 기대해주세요...' },
    hangzhouDesc: { zh: '预计2027年落地，筹备中', en: 'Expected to launch in 2027, in preparation', ja: '2027年落地予定、準備中', ko: '2027년 락지 예정, 준비 중' },
    groups: {
      weibo: '',
      douyin: '',
      qq: '',
      xiaohongshu: '',
      wechat: '',
    },
  },
    theme: { primaryColor: '#d4b878', secondaryColor: '#c4a868', backgroundColor: '#0a0a0a', cardStyle: 'glass', fontSize: 'medium', borderRadius: 12 },
};

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

// ============ 共享 CMS: 从 /data/content.json 加载已发布内容 ============
// 存储架构（三层）:
//   1. defaultContent（硬编码兜底）
//   2. /data/content.json（构建时生成的已发布内容，所有访问者共享）
//   3. localStorage（管理员本地的 CMS 修改，优先级最高）
//
// 管理员编辑 → localStorage → 立即在前台可见（同浏览器）
// 管理员发布 → 下载 content.json → 重新构建部署 → 全站可见
const STORAGE_KEY = 'aventurine_site_content'
const PUBLISHED_KEY = 'aventurine_published_content'  // 已发布的全量快照

function loadLocalDiff(): Partial<SiteContent> | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}

function saveLocalDiff(diff: Record<string, unknown>) {
  if (Object.keys(diff).length === 0) {
    localStorage.removeItem(STORAGE_KEY)
  } else {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(diff))
  }
}

/** 保存已发布的全量快照，作为 content.json 更新前的本地缓存 */
function savePublishedSnapshot(content: SiteContent) {
  try {
    localStorage.setItem(PUBLISHED_KEY, JSON.stringify(content))
  } catch { /* 忽略存储限制 */ }
}

/** 加载已发布的快照（仅在无本地修改时使用） */
function loadPublishedSnapshot(): SiteContent | null {
  try {
    const raw = localStorage.getItem(PUBLISHED_KEY)
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}

interface PublishResult {
  success: boolean;
  message: string;
  commitUrl?: string;
}

interface ContentContextValue {
  content: SiteContent;
  updateContent: (path: string, value: unknown) => void;
  resetContent: () => void;
  isDirty: boolean;
  /** 发布内容：推送到 GitHub → 自动部署到 aventurine0505.xyz */
  publishContent: () => Promise<PublishResult>;
  /** 是否正在发布 */
  isPublishing: boolean;
  /** 同步内容到全站：将当前内容保存为全站基准 */
  syncToSite: () => void;
  /** 最后发布结果 */
  lastPublishResult: PublishResult | null;
}

const ContentCtx = createContext<ContentContextValue | null>(null)

export function ContentProvider({ children }: { children: ReactNode }) {
  // 初始状态：localStorage 差异 > 已发布快照 > 默认值（快速渲染，不等待 fetch）
  const [content, setContent] = useState<SiteContent>(() => {
    const localDiff = loadLocalDiff()
    if (localDiff) {
      return deepMerge(structuredClone(defaultContent), localDiff as any)
    }
    // 无本地编辑时，尝试使用已发布快照
    const published = loadPublishedSnapshot()
    if (published) {
      return published
    }
    return structuredClone(defaultContent)
  })
  const [isDirty, setIsDirty] = useState(() => loadLocalDiff() !== null)
  const [isPublishing, setIsPublishing] = useState(false)
  const [lastPublishResult, setLastPublishResult] = useState<PublishResult | null>(null)

  // 异步加载 /data/content.json（全站共享内容）
  useEffect(() => {
    fetch('/data/content.json')
      .then(res => {
        if (!res.ok) throw new Error('Not found')
        return res.json()
      })
      .then((remote: Partial<SiteContent>) => {
        if (remote && Object.keys(remote).length > 0) {
          const localDiff = loadLocalDiff()
          if (localDiff) {
            // 有本地 CMS 修改：合并远程 + 本地（本地优先）
            const merged = deepMerge(deepMerge(structuredClone(defaultContent), remote as any), localDiff as any)
            setContent(merged)
          } else {
            // 无本地修改：使用远程内容，同时更新快照
            const merged = deepMerge(structuredClone(defaultContent), remote as any)
            savePublishedSnapshot(merged)
            setContent(merged)
          }
          // 更新浏览器标题
          if (remote.siteConfig?.siteTitle) {
            document.title = remote.siteConfig.siteTitle
          }
          // 更新 favicon
          if (remote.siteConfig?.favicon) {
            const link = document.querySelector('link[rel="icon"]') as HTMLLinkElement
            if (link) link.href = remote.siteConfig.favicon
          }
        }
      })
      .catch(() => {
        // 没有远程内容，保持当前状态（默认值 + localStorage）
        // 如果连已发布快照都没有，尝试用默认值
        const localDiff = loadLocalDiff()
        if (!localDiff && !loadPublishedSnapshot()) {
          // 什么都不做，保持 useState 的初始值
        }
      })
  }, [])

  const saveContent = useCallback((newContent: SiteContent) => {
    const diff = getDiff(defaultContent as any, newContent as any)
    saveLocalDiff(diff)
    setIsDirty(Object.keys(diff).length > 0)
  }, [])

  const updateContent = useCallback((path: string, value: unknown) => {
    setContent(prev => {
      const next = structuredClone(prev)
      setByPath(next as any, path, value)
      saveContent(next)
      return next
    })
  }, [saveContent])

  const resetContent = useCallback(() => {
    setContent(structuredClone(defaultContent))
    localStorage.removeItem(STORAGE_KEY)
    localStorage.removeItem(PUBLISHED_KEY)
    setIsDirty(false)
  }, [])

  /** 同步到全站：保存已发布快照，确保前台展示最新内容 */
  const syncToSite = useCallback(() => {
    savePublishedSnapshot(content)
    // 不清除 localStorage 差异，保持 CMS 中的编辑状态
    console.log('[同步] 内容已同步到全站快照')
  }, [content])

  /** 发布内容：推送到 GitHub → GitHub Actions 自动部署到 aventurine0505.xyz */
  const publishContent = useCallback(async (): Promise<PublishResult> => {
    setIsPublishing(true)
    setLastPublishResult(null)
    try {
      const jsonStr = preparePublishContent(content as any)
      // 也下载一份作为备份
      downloadContentJson(jsonStr)
      // 推送到 GitHub
      const result = await publishToGitHub(jsonStr)
      if (result.success) {
        savePublishedSnapshot(content)
        console.log('[发布] 已推送至 GitHub，等待自动部署...')
      }
      setLastPublishResult(result)
      return result
    } catch (err: any) {
      const result: PublishResult = { success: false, message: `发布失败：${err.message || '未知错误'}` }
      setLastPublishResult(result)
      return result
    } finally {
      setIsPublishing(false)
    }
  }, [content])

  return (
    <ContentCtx.Provider value={{ content, updateContent, resetContent, isDirty, publishContent, isPublishing, syncToSite, lastPublishResult }}>
      {children}
    </ContentCtx.Provider>
  )
}

export function useContent() {
  const ctx = useContext(ContentCtx)
  if (!ctx) throw new Error('useContent must be used within ContentProvider')
  return ctx
}

export { defaultContent }
