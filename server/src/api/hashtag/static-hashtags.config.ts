import type { HashtagCreateDto } from './dto/hashtag.create.dto';

export const STATIC_HASHTAGS: HashtagCreateDto[] = [
  {
    tag: 'hybrid-ses',
    nameUk: 'Гібридна СЕС',
    nameRu: 'Гибридная СЭС',
  },
  {
    tag: 'network-ses',
    nameUk: 'Мережева СЕС',
    nameRu: 'Сетевая СЭС',
  },
  {
    tag: 'green-tariff-ses',
    nameUk: 'СЕС під Зелений Тариф',
    nameRu: 'СЭС под Зеленый Тариф',
  },
  {
    tag: 'ups',
    nameUk: 'ДБЖ',
    nameRu: 'ИБП',
  },
  {
    tag: 'net-billing',
    nameUk: 'Net billing',
    nameRu: 'Net billing',
  },
  {
    tag: 'net-metering',
    nameUk: 'Net metering',
    nameRu: 'Net metering',
  },
  {
    tag: 'home',
    nameUk: 'Для дому',
    nameRu: 'Для дома',
  },
  {
    tag: 'enterprise',
    nameUk: 'Для бізнесу',
    nameRu: 'Для бизнеса',
  },
];
