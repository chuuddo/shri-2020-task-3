# Ошибки

1. Устанавливаю пакеты `npm i`, запускаю по **F5** дебаг. VS Code сообщает о 2 ошибках в файле `server.ts`:

    - `Argument of type '(params: InitializeParams) => { capabilities: { textDocumentSync: string; }; }' is not assignable to parameter of type 'RequestHandler<InitializeParams, InitializeResult, InitializeError>'. Types of property 'textDocumentSync' are incompatible. Type 'string' is not assignable to type '0 | TextDocumentSyncOptions | 1 | 2 | undefined'.`

        Жму **F12** на `textDocumentSync` и нахожу описание типа в котором указано, что значение `1` соответствует полной синхронизации документа и сервера. Установливаю пока это значение.

    - `Property 'loc' does not exist on type 'AstIdentifier'.`

        Опыт работы с библиотекой `json-to-ast` во втором задании подсказывает, что у интерфейса `AstIdentifier` забыли указать поле `loc`. [Исходники библиотеки](https://github.com/vtrushin/json-to-ast/blob/master/lib/parse.js#L231) лишь подтверждают это.

1. Запускаю дебаг, открываю вкладку Preview по **Ctrl+Shift+V** и вижу `{{content}}`. Похоже на какую-то проблему с шаблонизацией. Нахожу функцию `updateContent` в  файле `extension.ts` и обращаю внимание на `switch` в котором один из кейсов равен `content`. Ставлю брейкпоинты на всех выходах из `switch`, но дебагер не заходит в них. Думаю, может дебагер сломался. Перехожу к тяжелой артилерии и вставляю `console.log(str);` перед `switch`, а в дебаг консоли тишина. Тут я подвис и не понимал почему функция не выполняется. Полез на MDN смотреть документацию на `String.replace()`. [Оказалось](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/String/replace#Specifying_a_function_as_a_parameter) функция запускается только при успешном сопоставлении. Значит проблема в регулярном выражении. Внимательно посмотрев на него, можно заметить, что там используется выражение `\s+`, которое соответствуют одному или более пробельному символу. Меняю на `\s*`, которое соответствуют нулю или более пробельному символу. Дебагер теперь ходит по `switch` и в `panel.webview.html` присваивается сгенерированный html. Вкладка Preview теперь пустая.
