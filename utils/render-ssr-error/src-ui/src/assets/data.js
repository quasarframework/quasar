export default import.meta.env.DEV
  ? {
      rootFolder: '/qaz-v-js',
      error: {
        name: 'ReferenceError',
        message: 'window is not defined'
      },
      stack: [
        {
          fileName: '/qaz-v-js/src/components/BreakComponent.vue',
          sourceCode: {
            linesList: [
              '',
              'const icecream = ref(true)',
              'watch(icecream, () => {',
              "  console.log('icecream changed')",
              '  window.gigi()',
              '}, { immediate: true })',
              '</script>',
              ''
            ],
            startLineNumber: 6,
            maxLineNumberLen: 2,
            highlightTopOffset: '121px'
          },
          functionName: '__vite_ssr_import_0__.watch',
          methodName: 'immediate',
          native: false,
          lineNumber: 11,
          columnNumber: 3
        },
        {
          fileName:
            '/qaz-v-js/node_modules/@vue/runtime-core/dist/runtime-core.cjs.js',
          sourceCode: {
            linesList: [
              '};',
              'function callWithErrorHandling(fn, instance, type, args) {',
              '    let res;',
              '    try {',
              '        res = args ? fn(...args) : fn();',
              '    }',
              '    catch (err) {',
              '        handleError(err, instance, type);',
              '    }',
              '    return res;'
            ],
            startLineNumber: 166,
            maxLineNumberLen: 3,
            highlightTopOffset: '121px'
          },
          functionName: 'callWithErrorHandling',
          methodName: '<anonymous>',
          native: false,
          lineNumber: 171,
          columnNumber: 22
        },
        {
          fileName:
            '/qaz-v-js/node_modules/@vue/runtime-core/dist/runtime-core.cjs.js',
          sourceCode: {
            linesList: [
              '    return res;',
              '}',
              'function callWithAsyncErrorHandling(fn, instance, type, args) {',
              '    if (shared.isFunction(fn)) {',
              '        const res = callWithErrorHandling(fn, instance, type, args);',
              '        if (res && shared.isPromise(res)) {',
              '            res.catch(err => {',
              '                handleError(err, instance, type);',
              '            });',
              '        }'
            ],
            startLineNumber: 175,
            maxLineNumberLen: 3,
            highlightTopOffset: '121px'
          },
          functionName: 'callWithAsyncErrorHandling',
          methodName: '<anonymous>',
          native: false,
          lineNumber: 180,
          columnNumber: 21
        },
        {
          fileName:
            '/qaz-v-js/node_modules/@vue/runtime-core/dist/runtime-core.cjs.js',
          sourceCode: {
            linesList: [
              '        if (!cb) {',
              '            getter();',
              '        }',
              '        else if (immediate) {',
              '            callWithAsyncErrorHandling(cb, instance, 3 /* ErrorCodes.WATCH_CALLBACK */, [',
              '                getter(),',
              '                isMultiSource ? [] : undefined,',
              '                onCleanup',
              '            ]);',
              '        }'
            ],
            startLineNumber: 1764,
            maxLineNumberLen: 4,
            highlightTopOffset: '121px'
          },
          functionName: 'doWatch',
          methodName: '<anonymous>',
          native: false,
          lineNumber: 1769,
          columnNumber: 13
        },
        {
          fileName:
            '/qaz-v-js/node_modules/@vue/runtime-core/dist/runtime-core.cjs.js',
          sourceCode: {
            linesList: [
              '        warn(`\\`watch(fn, options?)\\` signature has been moved to a separate API. ` +',
              '            `Use \\`watchEffect(fn, options?)\\` instead. \\`watch\\` now only ` +',
              '            `supports \\`watch(source, cb, options?) signature.`);',
              '    }',
              '    return doWatch(source, cb, options);',
              '}',
              'function doWatch(source, cb, { immediate, deep, flush, onTrack, onTrigger } = shared.EMPTY_OBJ) {',
              '    if (!cb) {',
              '        if (immediate !== undefined) {',
              '            warn(`watch() "immediate" option is only respected when using the ` +'
            ],
            startLineNumber: 1674,
            maxLineNumberLen: 4,
            highlightTopOffset: '121px'
          },
          functionName: 'Proxy',
          methodName: 'watch',
          native: false,
          lineNumber: 1679,
          columnNumber: 12
        },
        {
          fileName: '/qaz-v-js/src/components/BreakComponent.vue',
          sourceCode: {
            linesList: [
              '<script setup>',
              "import { ref, watch } from 'vue'",
              '',
              'const icecream = ref(true)',
              'watch(icecream, () => {',
              "  console.log('icecream changed')",
              '  window.gigi()',
              '}, { immediate: true })',
              '</script>',
              ''
            ],
            startLineNumber: 4,
            maxLineNumberLen: 2,
            highlightTopOffset: '121px'
          },
          functionName: 'setup',
          methodName: '<anonymous>',
          native: false,
          lineNumber: 9,
          columnNumber: null
        },
        {
          fileName: '/src/components/BreakComponent.vue',
          sourceCode: null,
          functionName: '_sfc_main',
          methodName: 'setup',
          native: false,
          lineNumber: 38,
          columnNumber: 23
        },
        {
          fileName:
            '/qaz-v-js/node_modules/@vue/runtime-core/dist/runtime-core.cjs.js',
          sourceCode: {
            linesList: [
              '};',
              'function callWithErrorHandling(fn, instance, type, args) {',
              '    let res;',
              '    try {',
              '        res = args ? fn(...args) : fn();',
              '    }',
              '    catch (err) {',
              '        handleError(err, instance, type);',
              '    }',
              '    return res;'
            ],
            startLineNumber: 166,
            maxLineNumberLen: 3,
            highlightTopOffset: '121px'
          },
          functionName: 'callWithErrorHandling',
          methodName: '<anonymous>',
          native: false,
          lineNumber: 171,
          columnNumber: 22
        },
        {
          fileName:
            '/qaz-v-js/node_modules/@vue/runtime-core/dist/runtime-core.cjs.js',
          sourceCode: {
            linesList: [
              '        const setupContext = (instance.setupContext =',
              '            setup.length > 1 ? createSetupContext(instance) : null);',
              '        setCurrentInstance(instance);',
              '        reactivity.pauseTracking();',
              '        const setupResult = callWithErrorHandling(setup, instance, 0 /* ErrorCodes.SETUP_FUNCTION */, [reactivity.shallowReadonly(instance.props) , setupContext]);',
              '        reactivity.resetTracking();',
              '        unsetCurrentInstance();',
              '        if (shared.isPromise(setupResult)) {',
              '            setupResult.then(unsetCurrentInstance, unsetCurrentInstance);',
              '            if (isSSR) {'
            ],
            startLineNumber: 7189,
            maxLineNumberLen: 4,
            highlightTopOffset: '121px'
          },
          functionName: 'setupStatefulComponent',
          methodName: '<anonymous>',
          native: false,
          lineNumber: 7194,
          columnNumber: 29
        },
        {
          fileName:
            '/qaz-v-js/node_modules/@vue/runtime-core/dist/runtime-core.cjs.js',
          sourceCode: {
            linesList: [
              '    const isStateful = isStatefulComponent(instance);',
              '    initProps(instance, props, isStateful, isSSR);',
              '    initSlots(instance, children);',
              '    const setupResult = isStateful',
              '        ? setupStatefulComponent(instance, isSSR)',
              '        : undefined;',
              '    isInSSRComponentSetup = false;',
              '    return setupResult;',
              '}',
              'function setupStatefulComponent(instance, isSSR) {'
            ],
            startLineNumber: 7144,
            maxLineNumberLen: 4,
            highlightTopOffset: '121px'
          },
          functionName: 'setupComponent',
          methodName: '<anonymous>',
          native: false,
          lineNumber: 7149,
          columnNumber: 11
        }
      ],
      env: {
        Request: {
          'Node.js': 'Node.js 16.15.1 Darwin',
          'Server protocol': 'HTTP/1.1',
          'Remote address': '::1',
          'Remote port': 64_902,
          'Request URI': '/',
          'Request method': 'GET',
          'Request pathname': '/',
          'Request query string': ''
        },
        Headers: {
          host: 'localhost:9100',
          connection: 'keep-alive',
          pragma: 'no-cache',
          'cache-control': 'no-cache',
          'sec-ch-ua':
            '"Chromium";v="112", "Google Chrome";v="112", "Not:A-Brand";v="99"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"macOS"',
          dnt: '1',
          'upgrade-insecure-requests': '1',
          'user-agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36',
          accept:
            'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
          'sec-fetch-site': 'none',
          'sec-fetch-mode': 'navigate',
          'sec-fetch-user': '?1',
          'sec-fetch-dest': 'document',
          'accept-encoding': 'gzip, deflate, br',
          'accept-language':
            'en-US,en;q=0.9,ro;q=0.8,fr;q=0.7,ro-RO;q=0.6,es;q=0.5,la;q=0.4',
          cookie: 'gdpr=true; theme=dark'
        },
        Cookies: {
          gdpr: 'true',
          theme: 'dark'
        }
      }
    }
  : '<!-- inject:data -->'
