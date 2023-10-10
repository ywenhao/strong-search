import type { FilterItem } from '@/types'

export const filterList = [
  {
    name: '域名',
    popover: 'date',
    type: 'domain'
  },
  {
    name: '源站',
    type: 'source-site'
  },
  {
    name: '标签',
    type: 'tag'
  },
  {
    name: '标签键',
    type: 'tag-key'
  },
  {
    name: '所属项目',
    type: 'project'
  }
] satisfies FilterItem[]
