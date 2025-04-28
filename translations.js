function translatePage() {
    // Translate regular elements
    $('[data-i18n]').each(function() {
        const $element = $(this);
        const key = $element.attr('data-i18n');
        const translation = i18next.t(key);
        $element.text(translation);
    });

    // Translate placeholders
    $('[data-i18n-placeholder]').each(function() {
        const $element = $(this);
        const key = $element.attr('data-i18n-placeholder');
        const translation = i18next.t(key);
        $element.attr('placeholder', translation);
    });

    // Translate select options
    $('select option[data-i18n]').each(function() {
        const $element = $(this);
        const key = $element.attr('data-i18n');
        const translation = i18next.t(key);
        $element.text(translation);
    });
}

document.addEventListener('DOMContentLoaded', function() {
    i18next
        .use(window.i18nextHttpBackend)
        .init({
            lng: 'en', // Set default language to English
            fallbackLng: 'en',
            debug: true,
            backend: {
                loadPath: './locales/{{lng}}/translation.json'
            }
        })
        .then(function() {
            jqueryI18next.init(i18next, $, {
                useOptionsAttr: true
            });
            
            // Set initial language selector value
            $('#languageSelect').val('en');
            translatePage();
            
            // Set up language change handler
            $('#languageSelect').on('change', function() {
                const lang = $(this).val();
                i18next.changeLanguage(lang).then(() => {
                    translatePage();
                });
            });
        });
});