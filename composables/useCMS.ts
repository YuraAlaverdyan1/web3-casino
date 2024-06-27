import { createGlobalState } from '@vueuse/core'
import axios from 'axios'
import { ref, watch } from 'vue'

export interface DetailsModal {
  BodyDescription: string
  BodyTitle: string
  BottomBox: string
  TopSubTitle: string
  TopTitle: string
  id: number
}

export interface Banner {
  CTABackground: string
  CTALink: string
  CTAText: string
  CTAIcon: string
  HasCTA: boolean
  HasDetailsModal: boolean
  RandomBackgrounds: string[]
  SubTitle: string
  Title: string
  TopTitle: string
  Exclusive: string
  id: number,
  DetailsModal: DetailsModal
}

export const profileIndex = {
  0: 'ProfileReferral',
  1: 'ProfileBuilder',
  2: 'ProfileBankroller'
}

export const useCMS = createGlobalState(() => {
  // eslint-disable-next-line no-undef
  const config = useRuntimeConfig()
  const { locale } = useI18n()

  // Attributes
  const globalBanners = ref<Banner[]>([])
  const strapiURL = config.public.strapiURL

  async function getGlobalBanners() {
    globalBanners.value = []
    const { data: { data } } = await axios.get(
      `${strapiURL}/api/globals?populate[0]=Banner&populate[1]=Banner.RandomBackgrounds&populate[2]=Banner.RandomBackgrounds.Images&populate[3]=Banner.Testtile&populate[4]=Banner.DetailsModal&locale=${locale.value}`,
      {
        headers: {
          Authorization: `Bearer ${config.public.strapiApiKey}`
        }
      }
    )
    data.forEach((item: any) => {
      globalBanners.value = [
        ...globalBanners.value,
        {
          CTABackground: item.attributes.Banner.CTABackground,
          CTALink: item.attributes.Banner.CTALink,
          CTAText: item.attributes.Banner.CTAText,
          HasDetailsModal: item.attributes.Banner.HasDetailsModal,
          RandomBackgrounds:
            item.attributes.Banner.RandomBackgrounds.Images.data.map(
              ({ attributes }: any) => attributes.url
            ),
          SubTitle: item.attributes.Banner.SubTitle,
          Title: item.attributes.Banner.Title,
          TopTitle: item.attributes.Banner.TopTitle,
          id: item.id,
          HasCTA: item.attributes.Banner.HasCTA,
          Exclusive: item.attributes.Exclusive,
          CTAIcon: item.attributes.Banner.CTAIcon,
          DetailsModal: item.attributes.Banner.DetailsModal
        }
      ]
    })
    console.log('strapi:>>>> ', globalBanners.value)
  }

  watch(locale, () => {
    getGlobalBanners()
  })

  return {
    getGlobalBanners,
    globalBanners,
    strapiURL
  }
})
