import defaultSettings from '@/settings'

const title = defaultSettings.title || '智慧党建'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
