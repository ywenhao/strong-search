import type { FilterItem } from './components/strong-search/types'

// popover 不写为默认输入
export const filterList = [
  {
    name: '域名',
    type: 'domain'
  },
  {
    name: '源站',
    type: 'source-site',
    popover: 'select',
    popoverOption: {
      select: [
        {
          label: '嘻嘻嘻嘻嘻嘻嘻嘻嘻嘻嘻嘻嘻嘻嘻嘻嘻嘻嘻嘻嘻嘻嘻嘻嘻嘻嘻嘻嘻嘻嘻嘻嘻嘻',
          value: '嘻嘻嘻嘻嘻嘻嘻嘻嘻嘻嘻嘻嘻嘻嘻嘻嘻嘻嘻嘻嘻嘻嘻嘻嘻嘻嘻嘻嘻嘻嘻嘻嘻嘻'
        },
        { label: '嘎嘎', value: '3' },
        { label: '是否', value: '2' },
        { label: '搜索', value: '1' }
      ]
    }
  },
  {
    name: '标签',
    type: 'tag',
    popover: 'check',
    popoverOption: {
      check: [
        {
          label: '嘻嘻嘻嘻嘻嘻嘻嘻嘻嘻嘻嘻嘻嘻嘻嘻嘻嘻嘻嘻嘻嘻嘻嘻嘻嘻嘻嘻嘻嘻嘻嘻嘻嘻',
          value: 1212
        },
        { label: '哈哈', value: 222 },
        { label: '啊啊', value: '啊啊' },
        { label: '方法', value: '方法' }
      ]
    }
  },
  {
    name: '创建时间',
    popover: 'date',
    type: 'create-date'
  },
  {
    name: '所属项目',
    type: 'project'
  }
] satisfies FilterItem[]
