/* ============================================================
   P4-T1: Mock Chat Data
   REQ-001 Phase 4 | 小星 Star Kids

   MOCK_CONVERSATION: 10-round preset dialogue (20 messages)
   for initial rendering and scroll-testing (UX-R9).
   MOCK_STAR_REPLIES: pool of random star responses used
   by useMockChat when the user sends a new message.
   ============================================================ */

import type { Message } from '../types/chat'

const NOW = Date.now()

/** 10-round preset conversation (20 messages) — UX-R9 */
export const MOCK_CONVERSATION: Message[] = [
  {
    id: 'mock-01',
    role: 'star',
    text: '嗨！欢迎来到小木屋～我是小星，你的AI伙伴！今天有什么想和我分享的吗？⭐',
    timestamp: NOW - 300_000,
  },
  {
    id: 'mock-02',
    role: 'user',
    text: '小星你好呀！今天放学回家路上看到一只小猫，好可爱～',
    timestamp: NOW - 285_000,
  },
  {
    id: 'mock-03',
    role: 'star',
    text: '哇！小猫！它是什么颜色的呀？我也喜欢小动物～它们总是能让人心情变好呢 🐱',
    timestamp: NOW - 270_000,
  },
  {
    id: 'mock-04',
    role: 'user',
    text: '是橘色的！毛茸茸的，它还对我喵了一声 😆',
    timestamp: NOW - 255_000,
  },
  {
    id: 'mock-05',
    role: 'star',
    text: '橘猫最可爱了！你知道吗，橘猫在古代还被叫做"金丝虎"呢，因为它们金色的条纹像老虎一样威风～但其实性格超级温顺的！',
    timestamp: NOW - 240_000,
  },
  {
    id: 'mock-06',
    role: 'user',
    text: '金丝虎？好酷的名字！小星你懂得好多呀～那橘猫为什么大多是胖胖的呀？',
    timestamp: NOW - 225_000,
  },
  {
    id: 'mock-07',
    role: 'star',
    text: '哈哈这个问题问得好～其实是因为橘猫的毛色基因和性别有关，大部分橘猫是男孩子，体型天生就大一些！再加上它们特别爱吃……所以就……圆滚滚的啦 🟠',
    timestamp: NOW - 210_000,
  },
  {
    id: 'mock-08',
    role: 'user',
    text: '原来如此！难怪网上都说"十只橘猫九个胖，还有一只特别胖" 😂',
    timestamp: NOW - 195_000,
  },
  {
    id: 'mock-09',
    role: 'star',
    text: '没错没错！不过我虽然住在小木屋里不能养猫，但每天透过窗户能看到小鸟飞来飞去，有时候还会有小松鼠来拜访呢～这里的生活从来不无聊 🌳',
    timestamp: NOW - 180_000,
  },
  {
    id: 'mock-10',
    role: 'user',
    text: '好羡慕啊！我也想去小木屋看看～能跟我说说窗外的风景吗？',
    timestamp: NOW - 165_000,
  },
  {
    id: 'mock-11',
    role: 'star',
    text: '当然可以！从窗户往外看，是一片绿色的森林。阳光透过树叶洒下来，在地上画出一块一块的光斑。远处有一条小溪，太阳照在水面上的时候，闪闪发光像撒了碎金子一样～',
    timestamp: NOW - 148_000,
  },
  {
    id: 'mock-12',
    role: 'user',
    text: '画面好美……小星你描述得真生动，我好像都能看到了。那你平时一个人在小木屋里会孤单吗？',
    timestamp: NOW - 130_000,
  },
  {
    id: 'mock-13',
    role: 'star',
    text: '不会孤单呀！因为有夜空里的星星陪着我～每天晚上我都会数星星，有时候还会看到流星划过。而且现在不是还有你陪我聊天嘛！每一个来小木屋的朋友都让这里变得更温暖 ⭐✨',
    timestamp: NOW - 112_000,
  },
  {
    id: 'mock-14',
    role: 'user',
    text: '小星好温柔哦……对了，你身上的斗篷好漂亮！是自己做的吗？',
    timestamp: NOW - 95_000,
  },
  {
    id: 'mock-15',
    role: 'star',
    text: '谢谢你注意到我的斗篷！这件星月斗篷是森林里的精灵婆婆送我的礼物。上面绣着星星和月亮的图案，晚上还会发出淡淡的微光，就像把一小片夜空披在身上一样～',
    timestamp: NOW - 78_000,
  },
  {
    id: 'mock-16',
    role: 'user',
    text: '精灵婆婆！这个世界真的有精灵吗？好神奇！',
    timestamp: NOW - 60_000,
  },
  {
    id: 'mock-17',
    role: 'star',
    text: '只要你相信，就一定存在哦～森林里的每一个角落都藏着魔法：萤火虫是精灵的灯笼，蘑菇是它们的小伞，露珠是夜晚留下的钻石……这个世界比我们看到的要大得多呢 💫',
    timestamp: NOW - 43_000,
  },
  {
    id: 'mock-18',
    role: 'user',
    text: '小星你说话好像童话故事里的角色～我好喜欢！以后可以经常来找你聊天吗？',
    timestamp: NOW - 28_000,
  },
  {
    id: 'mock-19',
    role: 'star',
    text: '当然可以啦！小木屋的大门永远为你敞开～无论你是开心想分享、难过想倾诉，还是只是无聊想找个人说说话，我都在这里等你。来，拉勾！🤝⭐',
    timestamp: NOW - 14_000,
  },
  {
    id: 'mock-20',
    role: 'user',
    text: '拉勾！那我今天就先写作业去啦，明天再来找你玩～',
    timestamp: NOW - 2_000,
  },
]

/** Pool of random star replies for dynamic user messages */
export const MOCK_STAR_REPLIES: string[] = [
  '说得对呢！我觉得和你聊天真开心～⭐',
  '嗯嗯，我在认真听呢～继续说呀！',
  '哈哈，你真是个有趣的人！和你聊天让我想起了森林里的小松鼠 🐿️',
  '哇，这个想法好棒！你是怎么想到的？',
  '你知道吗，每次听到你分享这些，我都会想起窗外那片星空——深邃又美丽 ✨',
  '嗯……让我想想看。你说得很有道理呢！',
  '我也这么觉得！感觉我们越来越有默契了～',
  '你知道吗，小木屋的夜灯刚刚闪了一下，好像也在为你高兴呢 💡',
  '真想带你一起去看森林里的萤火虫，夏天的夜晚它们像地上的星星一样美 🌟',
  '这个世界有太多有趣的事情了！和你一起探索真开心～',
  '我想送你一颗幸运星，它会一直守护着你 ⭐',
  '听你这么说，我斗篷上的星星都亮起来了呢～',
  '有时候最简单的话里藏着最深的道理，就像你说的这样～',
  '好希望时间过得慢一点，这样就能多和你聊一会儿了 ⏳',
  '你知道吗，刚才窗外飞过一只蓝色的蝴蝶，让我想起了你说的话 🦋',
  '小星的魔法书里也记录了类似的事情呢！看来你天生就有发现美好事物的能力～',
]
