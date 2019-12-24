# Лог выполнения задания

## Превью интерфейса

1. Устанавливаю пакеты `npm i`, запускаю по **F5** дебаг. VS Code сообщает о 2 ошибках в файле `server.ts`:

    - `Argument of type '(params: InitializeParams) => { capabilities: { textDocumentSync: string; }; }' is not assignable to parameter of type 'RequestHandler<InitializeParams, InitializeResult, InitializeError>'. Types of property 'textDocumentSync' are incompatible. Type 'string' is not assignable to type '0 | TextDocumentSyncOptions | 1 | 2 | undefined'.`

        Жму **F12** на `textDocumentSync` и нахожу описание типа в котором указано, что значение `1` соответствует полной синхронизации документа и сервера. Установливаю пока это значение.

    - `Property 'loc' does not exist on type 'AstIdentifier'.`

        Опыт работы с библиотекой `json-to-ast` во втором задании подсказывает, что у интерфейса `AstIdentifier` забыли указать поле `loc`. [Исходники библиотеки](https://github.com/vtrushin/json-to-ast/blob/master/lib/parse.js#L231) лишь подтверждают это.

1. Запускаю дебаг, открываю вкладку Preview по **Ctrl+Shift+V** и вижу `{{content}}`. Похоже на какую-то проблему с шаблонизацией. Нахожу функцию `updateContent` в  файле `extension.ts` и обращаю внимание на `switch` в котором один из кейсов равен `content`. Ставлю брейкпоинты на всех выходах из `switch`, но дебагер не заходит в них. Думаю, может дебагер сломался. Перехожу к тяжелой артилерии и вставляю `console.log(str);` перед `switch`, а в дебаг консоли тишина. Тут я подвис и не понимал почему функция не выполняется. Полез на MDN смотреть документацию на `String.replace()`. [Оказалось](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/String/replace#Specifying_a_function_as_a_parameter) функция запускается только при успешном сопоставлении. Значит проблема в регулярном выражении. Внимательно посмотрев на него, можно заметить, что там используется выражение `\s+`, которое соответствуют одному или более пробельному символу. Меняю на `\s*`, которое соответствуют нулю или более пробельному символу. Дебагер теперь ходит по `switch` и в `panel.webview.html` присваивается сгенерированный html. Вкладка Preview теперь пустая.

1. Решил убедиться, что сгенерированный html добирается до Preview вкладки. Запускаю в VS Code команду **Developer: Open Webview Developer Tools**  html добавляется, но в консоли замечаю ошибку `Failed to load resource: net::ERR_UNKNOWN_URL_SCHEME resource:/d%3A/Dev/Shri/shri-2020-3/preview/style.css`. Поиск по этой ошибки ничем мне не помог. Пробую закоментировать строку `.with({ scheme: "resource"})` и получаю уже другую ошибку `Not allowed to load local resource`. Поиск по этой ошибке выводит меня на [документацию по vscode webview](https://code.visualstudio.com/api/extension-guides/webview#loading-local-content), где глаз цепляется за `vscode-resource`. Пробую эту схему. Ошибка пропадает, но вкладка Preview всё еще пустая.

1. В Dev Tools начал смотреть стили блоков на Preview вкладке, а там только `div { display: block; }`. Оказалось в стилях указаны селекторы по классу, а не по типу элемента. Исправляю. Теперь на вкладке Preview что-то похожее на то, что изображено на скриншоте к заданию.

1. Проверяю функционал по списку в задании - всё работает. нужно лишь добавить стили из первого задания.

1. Добавляю стили. Все работает, темы переключаются, блоки перестраиваются при растягивании окна Preview.

## Линтер структуры блоков

1. Запускаю дебаг. Перевожу названия некоторых свойств в верхний регистр и ничего не происходит, никаких ошибок в консоль. Начинаю ставить брейкпоинты во всех методах и колбеках файла `server.ts`. Перезапускаю дебаг и ни один брейкпоинт не сработал. Начинаю расставлять `console.log()` вместо брейпоинтов. Снова тишина в DEBUG CONSOLE. Вспоминаю, что у линтера есть настройки. Захожу в настройки расширения и включаю линтер. Никакого эффекта. Начинаю смотреть документацию как правильно дебажить. Нахожу на [этой странице](https://code.visualstudio.com/api/language-extensions/language-server-extension-guide) ссылку на проект `lsp-sample` и упоминание, что [можно дебажить клиент и сервер одновременно](https://code.visualstudio.com/api/language-extensions/language-server-extension-guide#debugging-both-client-and-server). Изучаю [launch.json](https://github.com/microsoft/vscode-extension-samples/blob/master/lsp-sample/.vscode/launch.json) того проекта. Добавляю конфигурацию для дебага сервера. Запускаю дебаг. Ошибки и консольлоги появились в DEBUG CONSOLE.

1. Ставлю бейкпоинт на `Uncaught Exceptions`, меняю текст в документе и дебагер останавливается на строке `node_modules\json-to-ast\build.js:1960:5`. Просмотрев call stack становится понятно, что на вход библиотеки `json-to-ast` подается адрес до файла вместо его содержимого. Ошибка в строке `const json = textDocument.uri;` функции `validateTextDocument`. Жму **F12** на типе `TextDocument` и нахожу метод `getText(range?: Range): string;`, который должен возвращать текст документа. Исправляю. Ошибка пропадает. Проверяю дебагером - AST дерево генерируется. Линтер не выводит никаких ошибок, хотя в документе они есть.

1. Начинаю дебажить функции `validateObject` и `validateProperty`. Добираялсь до элементов с ошибками они возвращают не пустые массивы. Но в переменную `errors` объекты этих массивов не складывались. Виной всему функция `concat`, которая создает новый массив, а не добавляет элементы в имеющийся. Меняю на `push`. Ошибки стали появляться на вкладке PROBLEMS.

1. Проверяю работу линтера по пунктам из задания. Все работает кроме переключения `Severity` правил: 
    - При переключении в `Error` иконка ошибок меняется на `Info`, а не на `Error`.
    - Если оба правила переключить в `None`, то последнее переключенное правило остается висеть в ошибках. 

    Первый баг быстро нахожу в функции `GetSeverity` и исправляю. Для исправления второго дебажу функцию `validateTextDocument`. Там получается, что при выключении правил массив `diagnostics` становится пустым и из-за условного оператора он не отправляется на клиент, поэтому там всегда остается ошибка. Пробую убрать условный оператор. Всё работает.

1. Проверяю как работает линтер при исправлении ошибок и замечаю, что он не убирает подсветку, если json не валиден и выкидывает исключения в OUTPUT. ESLint, например, убирает все ошибки и выводит только ошибку, связанную с местом, которое он не смог распарсить. В рамках данной архитектуры и интерфейса `LinterProblem<TKey>` такие ошибки нельзя вывести, поэтому просто помещаю вызов библиотеки `json-to-ast` в `try{} catch{}` и возвращаю `undefined` в случае ошибки парсинга, как делал это во втором задании. Теперь линтер выводит ошибки только для валидного json. Не знаю является ли это ошибкой, которую надо было найти, но как улучшение выглядит неплохо.

1. После просмотра разборов заданий прошлых лет запомнил, что в заданиях на поиск ошибок добавляют мертвый код. Просмотрел весь исходный код и обнаружил что файлы `hash.ts` и `jsonMain.ts` никуда не импортируются. Удалил файлы. Раширение работает без изменений.

1. Навожу порядок в код стайле. Удаляю TSLint по причине:
    > TSLint will be deprecated some time in 2019.

    Устанавливаю ESLint, Prettier. Настраиваю конфиг и переношу некоторые правила из `tsconfig.json`. Запускаю `npm run lint:fix`. Вручную исправляю оставшиеся ошибки. Удаляю неиспользуемые пакеты.

1. Добавляю линтер из второго задания. Проверяю на тестовых данных второго задания. Ошибки выводятся. Настройки расширения работают.

1. Подчищаю `TODO` комментарии. Пока смотрел исходники примеров обратил внимание на эти [строки](https://github.com/microsoft/vscode-extension-samples/blob/master/lsp-sample/server/src/server.ts#L24-L26) и `textDocumentSync: documents.syncKind`. Подебажил и `docs.syncKind` действительно равен `1`. Избавляюсь от магических цифр и устанавливаю значение как в примере.
