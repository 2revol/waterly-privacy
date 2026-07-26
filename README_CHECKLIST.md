# Waterly 1.0 — Privacy / Release Checklist

Перед публикацией попросите Codex проверить именно release-сборку.

- [ ] Waterly 1.0 без рекламы и без рекламных SDK
- [ ] Функция «Другое» отключена
- [ ] Нет аккаунта и собственной облачной синхронизации
- [ ] Записи напитков и настройки хранятся локально
- [ ] Выведены все permissions из merged release manifest
- [ ] Проверены INTERNET, POST_NOTIFICATIONS, RECEIVE_BOOT_COMPLETED, exact alarm permissions
- [ ] Нет лишних location/contacts/camera/microphone/SMS/storage permissions
- [ ] Перечислены все production dependencies/SDK
- [ ] Проверено отсутствие Firebase Analytics/Crashlytics, Sentry, AppCenter и иной телеметрии либо они добавлены в политику
- [ ] Проверено, включён ли Android Auto Backup
- [ ] Проверено, какие данные могут покинуть устройство
- [ ] Нет медицинских обещаний о диагностике/лечении
- [ ] Имя разработчика и email заменены в RU/EN политиках
- [ ] После финальной проверки удалено предупреждение внизу публичных страниц
- [ ] URL GitHub Pages открывается без логина и по HTTPS
- [ ] Ссылка добавлена в AppGallery Connect и желательно в Waterly → Настройки

## Текст для Codex
Проанализируй именно release-сборку Waterly 1.0 перед публикацией в Huawei AppGallery. Не меняй код. Выдай:
1) applicationId, versionName, versionCode;
2) все permissions из merged release manifest и назначение каждого;
3) все сторонние SDK/dependencies, которые могут собирать или передавать данные;
4) все сетевые endpoints/HTTP-клиенты;
5) наличие analytics, crash reporting, advertising, billing, cloud sync;
6) где хранятся записи напитков и настройки;
7) включён ли Android backup;
8) какие пользовательские данные могут покинуть устройство;
9) есть ли health/medical claims в строковых ресурсах;
10) любые расхождения с Privacy Policy, где заявлено: данные хранятся локально, рекламы и рекламных SDK нет, аккаунт и собственная облачная синхронизация отсутствуют.
Сохрани результат в docs/PRIVACY_AUDIT_1.0.md.
