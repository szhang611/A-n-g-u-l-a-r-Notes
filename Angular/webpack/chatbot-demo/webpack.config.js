const fs = require('fs');
const path = require('path');
const ConcatPlugin = require('webpack-concat-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ProgressPlugin = require('webpack/lib/ProgressPlugin');
const CircularDependencyPlugin = require('circular-dependency-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const autoprefixer = require('autoprefixer');
const postcssUrl = require('postcss-url');
const cssnano = require('cssnano');
const customProperties = require('postcss-custom-properties');

const { NoEmitOnErrorsPlugin, SourceMapDevToolPlugin, NamedModulesPlugin, LoaderOptionsPlugin } = require('webpack');
const { InsertConcatAssetsWebpackPlugin, NamedLazyChunksWebpackPlugin, BaseHrefWebpackPlugin } = require('@angular/cli/plugins/webpack');
const { CommonsChunkPlugin, ModuleConcatenationPlugin } = require('webpack').optimize;
const { AngularCompilerPlugin } = require('@ngtools/webpack');

const nodeModules = path.join(process.cwd(), 'node_modules');
const realNodeModules = fs.realpathSync(nodeModules);
const genDirNodeModules = path.join(process.cwd(), 'src', '$$_gendir', 'node_modules');
const entryPoints = ["inline", "assets/js/polyfills", "sw-register", "assets/js/styles", "assets/js/vendor", "assets/js/main"];
const minimizeCss = false;
const baseHref = "";
const deployUrl = "";

const postcssPlugins = function () {
  // safe settings based on: https://github.com/ben-eb/cssnano/issues/358#issuecomment-283696193
  const importantCommentRe = /@preserve|@license|[@#]\s*source(?:Mapping)?URL|^!/i;
  const minimizeOptions = {
    autoprefixer: false,
    safe: true,
    mergeLonghand: false,
    discardComments: { remove: (comment) => !importantCommentRe.test(comment) }
  };
  return [
    postcssUrl({
      url: (URL) => {
        // Only convert root relative URLs, which CSS-Loader won't process into require().
        if (!URL.startsWith('/') || URL.startsWith('//')) {
          return URL;
        }
        if (deployUrl.match(/:\/\//)) {
          // If deployUrl contains a scheme, ignore baseHref use deployUrl as is.
          return `${deployUrl.replace(/\/$/, '')}${URL}`;
        }
        else if (baseHref.match(/:\/\//)) {
          // If baseHref contains a scheme, include it as is.
          return baseHref.replace(/\/$/, '') +
            `/${deployUrl}/${URL}`.replace(/\/\/+/g, '/');
        }
        else {
          // Join together base-href, deploy-url and the original URL.
          // Also dedupe multiple slashes into single ones.
          return `/${baseHref}/${deployUrl}/${URL}`.replace(/\/\/+/g, '/');
        }
      }
    }),
    autoprefixer(),
    customProperties({ preserve: true })
  ].concat(minimizeCss ? [cssnano(minimizeOptions)] : []);
};

//manaually add
const CleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');


module.exports = {
  "resolve": {
    "extensions": [
      ".ts",
      ".js"
    ],
    "modules": [
      "./node_modules",
      "./node_modules"
    ],
    "symlinks": true,
    "alias": {
      "rxjs/AsyncSubject": __dirname + "\\node_modules\\rxjs\\_esm5\\AsyncSubject.js",
      "rxjs/BehaviorSubject": __dirname + "\\node_modules\\rxjs\\_esm5\\BehaviorSubject.js",
      "rxjs/InnerSubscriber": __dirname + "\\node_modules\\rxjs\\_esm5\\InnerSubscriber.js",
      "rxjs/Notification": __dirname + "\\node_modules\\rxjs\\_esm5\\Notification.js",
      "rxjs/Observable": __dirname + "\\node_modules\\rxjs\\_esm5\\Observable.js",
      "rxjs/Observer": __dirname + "\\node_modules\\rxjs\\_esm5\\Observer.js",
      "rxjs/Operator": __dirname + "\\node_modules\\rxjs\\_esm5\\Operator.js",
      "rxjs/OuterSubscriber": __dirname + "\\node_modules\\rxjs\\_esm5\\OuterSubscriber.js",
      "rxjs/ReplaySubject": __dirname + "\\node_modules\\rxjs\\_esm5\\ReplaySubject.js",
      "rxjs/Rx": __dirname + "\\node_modules\\rxjs\\_esm5\\Rx.js",
      "rxjs/Scheduler": __dirname + "\\node_modules\\rxjs\\_esm5\\Scheduler.js",
      "rxjs/Subject": __dirname + "\\node_modules\\rxjs\\_esm5\\Subject.js",
      "rxjs/SubjectSubscription": __dirname + "\\node_modules\\rxjs\\_esm5\\SubjectSubscription.js",
      "rxjs/Subscriber": __dirname + "\\node_modules\\rxjs\\_esm5\\Subscriber.js",
      "rxjs/Subscription": __dirname + "\\node_modules\\rxjs\\_esm5\\Subscription.js",
      "rxjs/add/observable/bindCallback": __dirname + "\\node_modules\\rxjs\\_esm5\\add\\observable\\bindCallback.js",
      "rxjs/add/observable/bindNodeCallback": __dirname + "\\node_modules\\rxjs\\_esm5\\add\\observable\\bindNodeCallback.js",
      "rxjs/add/observable/combineLatest": __dirname + "\\node_modules\\rxjs\\_esm5\\add\\observable\\combineLatest.js",
      "rxjs/add/observable/concat": __dirname + "\\node_modules\\rxjs\\_esm5\\add\\observable\\concat.js",
      "rxjs/add/observable/defer": __dirname + "\\node_modules\\rxjs\\_esm5\\add\\observable\\defer.js",
      "rxjs/add/observable/dom/ajax": __dirname + "\\node_modules\\rxjs\\_esm5\\add\\observable\\dom\\ajax.js",
      "rxjs/add/observable/dom/webSocket": __dirname + "\\node_modules\\rxjs\\_esm5\\add\\observable\\dom\\webSocket.js",
      "rxjs/add/observable/empty": __dirname + "\\node_modules\\rxjs\\_esm5\\add\\observable\\empty.js",
      "rxjs/add/observable/forkJoin": __dirname + "\\node_modules\\rxjs\\_esm5\\add\\observable\\forkJoin.js",
      "rxjs/add/observable/from": __dirname + "\\node_modules\\rxjs\\_esm5\\add\\observable\\from.js",
      "rxjs/add/observable/fromEvent": __dirname + "\\node_modules\\rxjs\\_esm5\\add\\observable\\fromEvent.js",
      "rxjs/add/observable/fromEventPattern": __dirname + "\\node_modules\\rxjs\\_esm5\\add\\observable\\fromEventPattern.js",
      "rxjs/add/observable/fromPromise": __dirname + "\\node_modules\\rxjs\\_esm5\\add\\observable\\fromPromise.js",
      "rxjs/add/observable/generate": __dirname + "\\node_modules\\rxjs\\_esm5\\add\\observable\\generate.js",
      "rxjs/add/observable/if": __dirname + "\\node_modules\\rxjs\\_esm5\\add\\observable\\if.js",
      "rxjs/add/observable/interval": __dirname + "\\node_modules\\rxjs\\_esm5\\add\\observable\\interval.js",
      "rxjs/add/observable/merge": __dirname + "\\node_modules\\rxjs\\_esm5\\add\\observable\\merge.js",
      "rxjs/add/observable/never": __dirname + "\\node_modules\\rxjs\\_esm5\\add\\observable\\never.js",
      "rxjs/add/observable/of": __dirname + "\\node_modules\\rxjs\\_esm5\\add\\observable\\of.js",
      "rxjs/add/observable/onErrorResumeNext": __dirname + "\\node_modules\\rxjs\\_esm5\\add\\observable\\onErrorResumeNext.js",
      "rxjs/add/observable/pairs": __dirname + "\\node_modules\\rxjs\\_esm5\\add\\observable\\pairs.js",
      "rxjs/add/observable/race": __dirname + "\\node_modules\\rxjs\\_esm5\\add\\observable\\race.js",
      "rxjs/add/observable/range": __dirname + "\\node_modules\\rxjs\\_esm5\\add\\observable\\range.js",
      "rxjs/add/observable/throw": __dirname + "\\node_modules\\rxjs\\_esm5\\add\\observable\\throw.js",
      "rxjs/add/observable/timer": __dirname + "\\node_modules\\rxjs\\_esm5\\add\\observable\\timer.js",
      "rxjs/add/observable/using": __dirname + "\\node_modules\\rxjs\\_esm5\\add\\observable\\using.js",
      "rxjs/add/observable/zip": __dirname + "\\node_modules\\rxjs\\_esm5\\add\\observable\\zip.js",
      "rxjs/add/operator/audit": __dirname + "\\node_modules\\rxjs\\_esm5\\add\\operator\\audit.js",
      "rxjs/add/operator/auditTime": __dirname + "\\node_modules\\rxjs\\_esm5\\add\\operator\\auditTime.js",
      "rxjs/add/operator/buffer": __dirname + "\\node_modules\\rxjs\\_esm5\\add\\operator\\buffer.js",
      "rxjs/add/operator/bufferCount": __dirname + "\\node_modules\\rxjs\\_esm5\\add\\operator\\bufferCount.js",
      "rxjs/add/operator/bufferTime": __dirname + "\\node_modules\\rxjs\\_esm5\\add\\operator\\bufferTime.js",
      "rxjs/add/operator/bufferToggle": __dirname + "\\node_modules\\rxjs\\_esm5\\add\\operator\\bufferToggle.js",
      "rxjs/add/operator/bufferWhen": __dirname + "\\node_modules\\rxjs\\_esm5\\add\\operator\\bufferWhen.js",
      "rxjs/add/operator/catch": __dirname + "\\node_modules\\rxjs\\_esm5\\add\\operator\\catch.js",
      "rxjs/add/operator/combineAll": __dirname + "\\node_modules\\rxjs\\_esm5\\add\\operator\\combineAll.js",
      "rxjs/add/operator/combineLatest": __dirname + "\\node_modules\\rxjs\\_esm5\\add\\operator\\combineLatest.js",
      "rxjs/add/operator/concat": __dirname + "\\node_modules\\rxjs\\_esm5\\add\\operator\\concat.js",
      "rxjs/add/operator/concatAll": __dirname + "\\node_modules\\rxjs\\_esm5\\add\\operator\\concatAll.js",
      "rxjs/add/operator/concatMap": __dirname + "\\node_modules\\rxjs\\_esm5\\add\\operator\\concatMap.js",
      "rxjs/add/operator/concatMapTo": __dirname + "\\node_modules\\rxjs\\_esm5\\add\\operator\\concatMapTo.js",
      "rxjs/add/operator/count": __dirname + "\\node_modules\\rxjs\\_esm5\\add\\operator\\count.js",
      "rxjs/add/operator/debounce": __dirname + "\\node_modules\\rxjs\\_esm5\\add\\operator\\debounce.js",
      "rxjs/add/operator/debounceTime": __dirname + "\\node_modules\\rxjs\\_esm5\\add\\operator\\debounceTime.js",
      "rxjs/add/operator/defaultIfEmpty": __dirname + "\\node_modules\\rxjs\\_esm5\\add\\operator\\defaultIfEmpty.js",
      "rxjs/add/operator/delay": __dirname + "\\node_modules\\rxjs\\_esm5\\add\\operator\\delay.js",
      "rxjs/add/operator/delayWhen": __dirname + "\\node_modules\\rxjs\\_esm5\\add\\operator\\delayWhen.js",
      "rxjs/add/operator/dematerialize": __dirname + "\\node_modules\\rxjs\\_esm5\\add\\operator\\dematerialize.js",
      "rxjs/add/operator/distinct": __dirname + "\\node_modules\\rxjs\\_esm5\\add\\operator\\distinct.js",
      "rxjs/add/operator/distinctUntilChanged": __dirname + "\\node_modules\\rxjs\\_esm5\\add\\operator\\distinctUntilChanged.js",
      "rxjs/add/operator/distinctUntilKeyChanged": __dirname + "\\node_modules\\rxjs\\_esm5\\add\\operator\\distinctUntilKeyChanged.js",
      "rxjs/add/operator/do": __dirname + "\\node_modules\\rxjs\\_esm5\\add\\operator\\do.js",
      "rxjs/add/operator/elementAt": __dirname + "\\node_modules\\rxjs\\_esm5\\add\\operator\\elementAt.js",
      "rxjs/add/operator/every": __dirname + "\\node_modules\\rxjs\\_esm5\\add\\operator\\every.js",
      "rxjs/add/operator/exhaust": __dirname + "\\node_modules\\rxjs\\_esm5\\add\\operator\\exhaust.js",
      "rxjs/add/operator/exhaustMap": __dirname + "\\node_modules\\rxjs\\_esm5\\add\\operator\\exhaustMap.js",
      "rxjs/add/operator/expand": __dirname + "\\node_modules\\rxjs\\_esm5\\add\\operator\\expand.js",
      "rxjs/add/operator/filter": __dirname + "\\node_modules\\rxjs\\_esm5\\add\\operator\\filter.js",
      "rxjs/add/operator/finally": __dirname + "\\node_modules\\rxjs\\_esm5\\add\\operator\\finally.js",
      "rxjs/add/operator/find": __dirname + "\\node_modules\\rxjs\\_esm5\\add\\operator\\find.js",
      "rxjs/add/operator/findIndex": __dirname + "\\node_modules\\rxjs\\_esm5\\add\\operator\\findIndex.js",
      "rxjs/add/operator/first": __dirname + "\\node_modules\\rxjs\\_esm5\\add\\operator\\first.js",
      "rxjs/add/operator/groupBy": __dirname + "\\node_modules\\rxjs\\_esm5\\add\\operator\\groupBy.js",
      "rxjs/add/operator/ignoreElements": __dirname + "\\node_modules\\rxjs\\_esm5\\add\\operator\\ignoreElements.js",
      "rxjs/add/operator/isEmpty": __dirname + "\\node_modules\\rxjs\\_esm5\\add\\operator\\isEmpty.js",
      "rxjs/add/operator/last": __dirname + "\\node_modules\\rxjs\\_esm5\\add\\operator\\last.js",
      "rxjs/add/operator/let": __dirname + "\\node_modules\\rxjs\\_esm5\\add\\operator\\let.js",
      "rxjs/add/operator/map": __dirname + "\\node_modules\\rxjs\\_esm5\\add\\operator\\map.js",
      "rxjs/add/operator/mapTo": __dirname + "\\node_modules\\rxjs\\_esm5\\add\\operator\\mapTo.js",
      "rxjs/add/operator/materialize": __dirname + "\\node_modules\\rxjs\\_esm5\\add\\operator\\materialize.js",
      "rxjs/add/operator/max": __dirname + "\\node_modules\\rxjs\\_esm5\\add\\operator\\max.js",
      "rxjs/add/operator/merge": __dirname + "\\node_modules\\rxjs\\_esm5\\add\\operator\\merge.js",
      "rxjs/add/operator/mergeAll": __dirname + "\\node_modules\\rxjs\\_esm5\\add\\operator\\mergeAll.js",
      "rxjs/add/operator/mergeMap": __dirname + "\\node_modules\\rxjs\\_esm5\\add\\operator\\mergeMap.js",
      "rxjs/add/operator/mergeMapTo": __dirname + "\\node_modules\\rxjs\\_esm5\\add\\operator\\mergeMapTo.js",
      "rxjs/add/operator/mergeScan": __dirname + "\\node_modules\\rxjs\\_esm5\\add\\operator\\mergeScan.js",
      "rxjs/add/operator/min": __dirname + "\\node_modules\\rxjs\\_esm5\\add\\operator\\min.js",
      "rxjs/add/operator/multicast": __dirname + "\\node_modules\\rxjs\\_esm5\\add\\operator\\multicast.js",
      "rxjs/add/operator/observeOn": __dirname + "\\node_modules\\rxjs\\_esm5\\add\\operator\\observeOn.js",
      "rxjs/add/operator/onErrorResumeNext": __dirname + "\\node_modules\\rxjs\\_esm5\\add\\operator\\onErrorResumeNext.js",
      "rxjs/add/operator/pairwise": __dirname + "\\node_modules\\rxjs\\_esm5\\add\\operator\\pairwise.js",
      "rxjs/add/operator/partition": __dirname + "\\node_modules\\rxjs\\_esm5\\add\\operator\\partition.js",
      "rxjs/add/operator/pluck": __dirname + "\\node_modules\\rxjs\\_esm5\\add\\operator\\pluck.js",
      "rxjs/add/operator/publish": __dirname + "\\node_modules\\rxjs\\_esm5\\add\\operator\\publish.js",
      "rxjs/add/operator/publishBehavior": __dirname + "\\node_modules\\rxjs\\_esm5\\add\\operator\\publishBehavior.js",
      "rxjs/add/operator/publishLast": __dirname + "\\node_modules\\rxjs\\_esm5\\add\\operator\\publishLast.js",
      "rxjs/add/operator/publishReplay": __dirname + "\\node_modules\\rxjs\\_esm5\\add\\operator\\publishReplay.js",
      "rxjs/add/operator/race": __dirname + "\\node_modules\\rxjs\\_esm5\\add\\operator\\race.js",
      "rxjs/add/operator/reduce": __dirname + "\\node_modules\\rxjs\\_esm5\\add\\operator\\reduce.js",
      "rxjs/add/operator/repeat": __dirname + "\\node_modules\\rxjs\\_esm5\\add\\operator\\repeat.js",
      "rxjs/add/operator/repeatWhen": __dirname + "\\node_modules\\rxjs\\_esm5\\add\\operator\\repeatWhen.js",
      "rxjs/add/operator/retry": __dirname + "\\node_modules\\rxjs\\_esm5\\add\\operator\\retry.js",
      "rxjs/add/operator/retryWhen": __dirname + "\\node_modules\\rxjs\\_esm5\\add\\operator\\retryWhen.js",
      "rxjs/add/operator/sample": __dirname + "\\node_modules\\rxjs\\_esm5\\add\\operator\\sample.js",
      "rxjs/add/operator/sampleTime": __dirname + "\\node_modules\\rxjs\\_esm5\\add\\operator\\sampleTime.js",
      "rxjs/add/operator/scan": __dirname + "\\node_modules\\rxjs\\_esm5\\add\\operator\\scan.js",
      "rxjs/add/operator/sequenceEqual": __dirname + "\\node_modules\\rxjs\\_esm5\\add\\operator\\sequenceEqual.js",
      "rxjs/add/operator/share": __dirname + "\\node_modules\\rxjs\\_esm5\\add\\operator\\share.js",
      "rxjs/add/operator/shareReplay": __dirname + "\\node_modules\\rxjs\\_esm5\\add\\operator\\shareReplay.js",
      "rxjs/add/operator/single": __dirname + "\\node_modules\\rxjs\\_esm5\\add\\operator\\single.js",
      "rxjs/add/operator/skip": __dirname + "\\node_modules\\rxjs\\_esm5\\add\\operator\\skip.js",
      "rxjs/add/operator/skipLast": __dirname + "\\node_modules\\rxjs\\_esm5\\add\\operator\\skipLast.js",
      "rxjs/add/operator/skipUntil": __dirname + "\\node_modules\\rxjs\\_esm5\\add\\operator\\skipUntil.js",
      "rxjs/add/operator/skipWhile": __dirname + "\\node_modules\\rxjs\\_esm5\\add\\operator\\skipWhile.js",
      "rxjs/add/operator/startWith": __dirname + "\\node_modules\\rxjs\\_esm5\\add\\operator\\startWith.js",
      "rxjs/add/operator/subscribeOn": __dirname + "\\node_modules\\rxjs\\_esm5\\add\\operator\\subscribeOn.js",
      "rxjs/add/operator/switch": __dirname + "\\node_modules\\rxjs\\_esm5\\add\\operator\\switch.js",
      "rxjs/add/operator/switchMap": __dirname + "\\node_modules\\rxjs\\_esm5\\add\\operator\\switchMap.js",
      "rxjs/add/operator/switchMapTo": __dirname + "\\node_modules\\rxjs\\_esm5\\add\\operator\\switchMapTo.js",
      "rxjs/add/operator/take": __dirname + "\\node_modules\\rxjs\\_esm5\\add\\operator\\take.js",
      "rxjs/add/operator/takeLast": __dirname + "\\node_modules\\rxjs\\_esm5\\add\\operator\\takeLast.js",
      "rxjs/add/operator/takeUntil": __dirname + "\\node_modules\\rxjs\\_esm5\\add\\operator\\takeUntil.js",
      "rxjs/add/operator/takeWhile": __dirname + "\\node_modules\\rxjs\\_esm5\\add\\operator\\takeWhile.js",
      "rxjs/add/operator/throttle": __dirname + "\\node_modules\\rxjs\\_esm5\\add\\operator\\throttle.js",
      "rxjs/add/operator/throttleTime": __dirname + "\\node_modules\\rxjs\\_esm5\\add\\operator\\throttleTime.js",
      "rxjs/add/operator/timeInterval": __dirname + "\\node_modules\\rxjs\\_esm5\\add\\operator\\timeInterval.js",
      "rxjs/add/operator/timeout": __dirname + "\\node_modules\\rxjs\\_esm5\\add\\operator\\timeout.js",
      "rxjs/add/operator/timeoutWith": __dirname + "\\node_modules\\rxjs\\_esm5\\add\\operator\\timeoutWith.js",
      "rxjs/add/operator/timestamp": __dirname + "\\node_modules\\rxjs\\_esm5\\add\\operator\\timestamp.js",
      "rxjs/add/operator/toArray": __dirname + "\\node_modules\\rxjs\\_esm5\\add\\operator\\toArray.js",
      "rxjs/add/operator/toPromise": __dirname + "\\node_modules\\rxjs\\_esm5\\add\\operator\\toPromise.js",
      "rxjs/add/operator/window": __dirname + "\\node_modules\\rxjs\\_esm5\\add\\operator\\window.js",
      "rxjs/add/operator/windowCount": __dirname + "\\node_modules\\rxjs\\_esm5\\add\\operator\\windowCount.js",
      "rxjs/add/operator/windowTime": __dirname + "\\node_modules\\rxjs\\_esm5\\add\\operator\\windowTime.js",
      "rxjs/add/operator/windowToggle": __dirname + "\\node_modules\\rxjs\\_esm5\\add\\operator\\windowToggle.js",
      "rxjs/add/operator/windowWhen": __dirname + "\\node_modules\\rxjs\\_esm5\\add\\operator\\windowWhen.js",
      "rxjs/add/operator/withLatestFrom": __dirname + "\\node_modules\\rxjs\\_esm5\\add\\operator\\withLatestFrom.js",
      "rxjs/add/operator/zip": __dirname + "\\node_modules\\rxjs\\_esm5\\add\\operator\\zip.js",
      "rxjs/add/operator/zipAll": __dirname + "\\node_modules\\rxjs\\_esm5\\add\\operator\\zipAll.js",
      "rxjs/interfaces": __dirname + "\\node_modules\\rxjs\\_esm5\\interfaces.js",
      "rxjs/observable/ArrayLikeObservable": __dirname + "\\node_modules\\rxjs\\_esm5\\observable\\ArrayLikeObservable.js",
      "rxjs/observable/ArrayObservable": __dirname + "\\node_modules\\rxjs\\_esm5\\observable\\ArrayObservable.js",
      "rxjs/observable/BoundCallbackObservable": __dirname + "\\node_modules\\rxjs\\_esm5\\observable\\BoundCallbackObservable.js",
      "rxjs/observable/BoundNodeCallbackObservable": __dirname + "\\node_modules\\rxjs\\_esm5\\observable\\BoundNodeCallbackObservable.js",
      "rxjs/observable/ConnectableObservable": __dirname + "\\node_modules\\rxjs\\_esm5\\observable\\ConnectableObservable.js",
      "rxjs/observable/DeferObservable": __dirname + "\\node_modules\\rxjs\\_esm5\\observable\\DeferObservable.js",
      "rxjs/observable/EmptyObservable": __dirname + "\\node_modules\\rxjs\\_esm5\\observable\\EmptyObservable.js",
      "rxjs/observable/ErrorObservable": __dirname + "\\node_modules\\rxjs\\_esm5\\observable\\ErrorObservable.js",
      "rxjs/observable/ForkJoinObservable": __dirname + "\\node_modules\\rxjs\\_esm5\\observable\\ForkJoinObservable.js",
      "rxjs/observable/FromEventObservable": __dirname + "\\node_modules\\rxjs\\_esm5\\observable\\FromEventObservable.js",
      "rxjs/observable/FromEventPatternObservable": __dirname + "\\node_modules\\rxjs\\_esm5\\observable\\FromEventPatternObservable.js",
      "rxjs/observable/FromObservable": __dirname + "\\node_modules\\rxjs\\_esm5\\observable\\FromObservable.js",
      "rxjs/observable/GenerateObservable": __dirname + "\\node_modules\\rxjs\\_esm5\\observable\\GenerateObservable.js",
      "rxjs/observable/IfObservable": __dirname + "\\node_modules\\rxjs\\_esm5\\observable\\IfObservable.js",
      "rxjs/observable/IntervalObservable": __dirname + "\\node_modules\\rxjs\\_esm5\\observable\\IntervalObservable.js",
      "rxjs/observable/IteratorObservable": __dirname + "\\node_modules\\rxjs\\_esm5\\observable\\IteratorObservable.js",
      "rxjs/observable/NeverObservable": __dirname + "\\node_modules\\rxjs\\_esm5\\observable\\NeverObservable.js",
      "rxjs/observable/PairsObservable": __dirname + "\\node_modules\\rxjs\\_esm5\\observable\\PairsObservable.js",
      "rxjs/observable/PromiseObservable": __dirname + "\\node_modules\\rxjs\\_esm5\\observable\\PromiseObservable.js",
      "rxjs/observable/RangeObservable": __dirname + "\\node_modules\\rxjs\\_esm5\\observable\\RangeObservable.js",
      "rxjs/observable/ScalarObservable": __dirname + "\\node_modules\\rxjs\\_esm5\\observable\\ScalarObservable.js",
      "rxjs/observable/SubscribeOnObservable": __dirname + "\\node_modules\\rxjs\\_esm5\\observable\\SubscribeOnObservable.js",
      "rxjs/observable/TimerObservable": __dirname + "\\node_modules\\rxjs\\_esm5\\observable\\TimerObservable.js",
      "rxjs/observable/UsingObservable": __dirname + "\\node_modules\\rxjs\\_esm5\\observable\\UsingObservable.js",
      "rxjs/observable/bindCallback": __dirname + "\\node_modules\\rxjs\\_esm5\\observable\\bindCallback.js",
      "rxjs/observable/bindNodeCallback": __dirname + "\\node_modules\\rxjs\\_esm5\\observable\\bindNodeCallback.js",
      "rxjs/observable/combineLatest": __dirname + "\\node_modules\\rxjs\\_esm5\\observable\\combineLatest.js",
      "rxjs/observable/concat": __dirname + "\\node_modules\\rxjs\\_esm5\\observable\\concat.js",
      "rxjs/observable/defer": __dirname + "\\node_modules\\rxjs\\_esm5\\observable\\defer.js",
      "rxjs/observable/dom/AjaxObservable": __dirname + "\\node_modules\\rxjs\\_esm5\\observable\\dom\\AjaxObservable.js",
      "rxjs/observable/dom/WebSocketSubject": __dirname + "\\node_modules\\rxjs\\_esm5\\observable\\dom\\WebSocketSubject.js",
      "rxjs/observable/dom/ajax": __dirname + "\\node_modules\\rxjs\\_esm5\\observable\\dom\\ajax.js",
      "rxjs/observable/dom/webSocket": __dirname + "\\node_modules\\rxjs\\_esm5\\observable\\dom\\webSocket.js",
      "rxjs/observable/empty": __dirname + "\\node_modules\\rxjs\\_esm5\\observable\\empty.js",
      "rxjs/observable/forkJoin": __dirname + "\\node_modules\\rxjs\\_esm5\\observable\\forkJoin.js",
      "rxjs/observable/from": __dirname + "\\node_modules\\rxjs\\_esm5\\observable\\from.js",
      "rxjs/observable/fromEvent": __dirname + "\\node_modules\\rxjs\\_esm5\\observable\\fromEvent.js",
      "rxjs/observable/fromEventPattern": __dirname + "\\node_modules\\rxjs\\_esm5\\observable\\fromEventPattern.js",
      "rxjs/observable/fromPromise": __dirname + "\\node_modules\\rxjs\\_esm5\\observable\\fromPromise.js",
      "rxjs/observable/generate": __dirname + "\\node_modules\\rxjs\\_esm5\\observable\\generate.js",
      "rxjs/observable/if": __dirname + "\\node_modules\\rxjs\\_esm5\\observable\\if.js",
      "rxjs/observable/interval": __dirname + "\\node_modules\\rxjs\\_esm5\\observable\\interval.js",
      "rxjs/observable/merge": __dirname + "\\node_modules\\rxjs\\_esm5\\observable\\merge.js",
      "rxjs/observable/never": __dirname + "\\node_modules\\rxjs\\_esm5\\observable\\never.js",
      "rxjs/observable/of": __dirname + "\\node_modules\\rxjs\\_esm5\\observable\\of.js",
      "rxjs/observable/onErrorResumeNext": __dirname + "\\node_modules\\rxjs\\_esm5\\observable\\onErrorResumeNext.js",
      "rxjs/observable/pairs": __dirname + "\\node_modules\\rxjs\\_esm5\\observable\\pairs.js",
      "rxjs/observable/race": __dirname + "\\node_modules\\rxjs\\_esm5\\observable\\race.js",
      "rxjs/observable/range": __dirname + "\\node_modules\\rxjs\\_esm5\\observable\\range.js",
      "rxjs/observable/throw": __dirname + "\\node_modules\\rxjs\\_esm5\\observable\\throw.js",
      "rxjs/observable/timer": __dirname + "\\node_modules\\rxjs\\_esm5\\observable\\timer.js",
      "rxjs/observable/using": __dirname + "\\node_modules\\rxjs\\_esm5\\observable\\using.js",
      "rxjs/observable/zip": __dirname + "\\node_modules\\rxjs\\_esm5\\observable\\zip.js",
      "rxjs/operator/audit": __dirname + "\\node_modules\\rxjs\\_esm5\\operator\\audit.js",
      "rxjs/operator/auditTime": __dirname + "\\node_modules\\rxjs\\_esm5\\operator\\auditTime.js",
      "rxjs/operator/buffer": __dirname + "\\node_modules\\rxjs\\_esm5\\operator\\buffer.js",
      "rxjs/operator/bufferCount": __dirname + "\\node_modules\\rxjs\\_esm5\\operator\\bufferCount.js",
      "rxjs/operator/bufferTime": __dirname + "\\node_modules\\rxjs\\_esm5\\operator\\bufferTime.js",
      "rxjs/operator/bufferToggle": __dirname + "\\node_modules\\rxjs\\_esm5\\operator\\bufferToggle.js",
      "rxjs/operator/bufferWhen": __dirname + "\\node_modules\\rxjs\\_esm5\\operator\\bufferWhen.js",
      "rxjs/operator/catch": __dirname + "\\node_modules\\rxjs\\_esm5\\operator\\catch.js",
      "rxjs/operator/combineAll": __dirname + "\\node_modules\\rxjs\\_esm5\\operator\\combineAll.js",
      "rxjs/operator/combineLatest": __dirname + "\\node_modules\\rxjs\\_esm5\\operator\\combineLatest.js",
      "rxjs/operator/concat": __dirname + "\\node_modules\\rxjs\\_esm5\\operator\\concat.js",
      "rxjs/operator/concatAll": __dirname + "\\node_modules\\rxjs\\_esm5\\operator\\concatAll.js",
      "rxjs/operator/concatMap": __dirname + "\\node_modules\\rxjs\\_esm5\\operator\\concatMap.js",
      "rxjs/operator/concatMapTo": __dirname + "\\node_modules\\rxjs\\_esm5\\operator\\concatMapTo.js",
      "rxjs/operator/count": __dirname + "\\node_modules\\rxjs\\_esm5\\operator\\count.js",
      "rxjs/operator/debounce": __dirname + "\\node_modules\\rxjs\\_esm5\\operator\\debounce.js",
      "rxjs/operator/debounceTime": __dirname + "\\node_modules\\rxjs\\_esm5\\operator\\debounceTime.js",
      "rxjs/operator/defaultIfEmpty": __dirname + "\\node_modules\\rxjs\\_esm5\\operator\\defaultIfEmpty.js",
      "rxjs/operator/delay": __dirname + "\\node_modules\\rxjs\\_esm5\\operator\\delay.js",
      "rxjs/operator/delayWhen": __dirname + "\\node_modules\\rxjs\\_esm5\\operator\\delayWhen.js",
      "rxjs/operator/dematerialize": __dirname + "\\node_modules\\rxjs\\_esm5\\operator\\dematerialize.js",
      "rxjs/operator/distinct": __dirname + "\\node_modules\\rxjs\\_esm5\\operator\\distinct.js",
      "rxjs/operator/distinctUntilChanged": __dirname + "\\node_modules\\rxjs\\_esm5\\operator\\distinctUntilChanged.js",
      "rxjs/operator/distinctUntilKeyChanged": __dirname + "\\node_modules\\rxjs\\_esm5\\operator\\distinctUntilKeyChanged.js",
      "rxjs/operator/do": __dirname + "\\node_modules\\rxjs\\_esm5\\operator\\do.js",
      "rxjs/operator/elementAt": __dirname + "\\node_modules\\rxjs\\_esm5\\operator\\elementAt.js",
      "rxjs/operator/every": __dirname + "\\node_modules\\rxjs\\_esm5\\operator\\every.js",
      "rxjs/operator/exhaust": __dirname + "\\node_modules\\rxjs\\_esm5\\operator\\exhaust.js",
      "rxjs/operator/exhaustMap": __dirname + "\\node_modules\\rxjs\\_esm5\\operator\\exhaustMap.js",
      "rxjs/operator/expand": __dirname + "\\node_modules\\rxjs\\_esm5\\operator\\expand.js",
      "rxjs/operator/filter": __dirname + "\\node_modules\\rxjs\\_esm5\\operator\\filter.js",
      "rxjs/operator/finally": __dirname + "\\node_modules\\rxjs\\_esm5\\operator\\finally.js",
      "rxjs/operator/find": __dirname + "\\node_modules\\rxjs\\_esm5\\operator\\find.js",
      "rxjs/operator/findIndex": __dirname + "\\node_modules\\rxjs\\_esm5\\operator\\findIndex.js",
      "rxjs/operator/first": __dirname + "\\node_modules\\rxjs\\_esm5\\operator\\first.js",
      "rxjs/operator/groupBy": __dirname + "\\node_modules\\rxjs\\_esm5\\operator\\groupBy.js",
      "rxjs/operator/ignoreElements": __dirname + "\\node_modules\\rxjs\\_esm5\\operator\\ignoreElements.js",
      "rxjs/operator/isEmpty": __dirname + "\\node_modules\\rxjs\\_esm5\\operator\\isEmpty.js",
      "rxjs/operator/last": __dirname + "\\node_modules\\rxjs\\_esm5\\operator\\last.js",
      "rxjs/operator/let": __dirname + "\\node_modules\\rxjs\\_esm5\\operator\\let.js",
      "rxjs/operator/map": __dirname + "\\node_modules\\rxjs\\_esm5\\operator\\map.js",
      "rxjs/operator/mapTo": __dirname + "\\node_modules\\rxjs\\_esm5\\operator\\mapTo.js",
      "rxjs/operator/materialize": __dirname + "\\node_modules\\rxjs\\_esm5\\operator\\materialize.js",
      "rxjs/operator/max": __dirname + "\\node_modules\\rxjs\\_esm5\\operator\\max.js",
      "rxjs/operator/merge": __dirname + "\\node_modules\\rxjs\\_esm5\\operator\\merge.js",
      "rxjs/operator/mergeAll": __dirname + "\\node_modules\\rxjs\\_esm5\\operator\\mergeAll.js",
      "rxjs/operator/mergeMap": __dirname + "\\node_modules\\rxjs\\_esm5\\operator\\mergeMap.js",
      "rxjs/operator/mergeMapTo": __dirname + "\\node_modules\\rxjs\\_esm5\\operator\\mergeMapTo.js",
      "rxjs/operator/mergeScan": __dirname + "\\node_modules\\rxjs\\_esm5\\operator\\mergeScan.js",
      "rxjs/operator/min": __dirname + "\\node_modules\\rxjs\\_esm5\\operator\\min.js",
      "rxjs/operator/multicast": __dirname + "\\node_modules\\rxjs\\_esm5\\operator\\multicast.js",
      "rxjs/operator/observeOn": __dirname + "\\node_modules\\rxjs\\_esm5\\operator\\observeOn.js",
      "rxjs/operator/onErrorResumeNext": __dirname + "\\node_modules\\rxjs\\_esm5\\operator\\onErrorResumeNext.js",
      "rxjs/operator/pairwise": __dirname + "\\node_modules\\rxjs\\_esm5\\operator\\pairwise.js",
      "rxjs/operator/partition": __dirname + "\\node_modules\\rxjs\\_esm5\\operator\\partition.js",
      "rxjs/operator/pluck": __dirname + "\\node_modules\\rxjs\\_esm5\\operator\\pluck.js",
      "rxjs/operator/publish": __dirname + "\\node_modules\\rxjs\\_esm5\\operator\\publish.js",
      "rxjs/operator/publishBehavior": __dirname + "\\node_modules\\rxjs\\_esm5\\operator\\publishBehavior.js",
      "rxjs/operator/publishLast": __dirname + "\\node_modules\\rxjs\\_esm5\\operator\\publishLast.js",
      "rxjs/operator/publishReplay": __dirname + "\\node_modules\\rxjs\\_esm5\\operator\\publishReplay.js",
      "rxjs/operator/race": __dirname + "\\node_modules\\rxjs\\_esm5\\operator\\race.js",
      "rxjs/operator/reduce": __dirname + "\\node_modules\\rxjs\\_esm5\\operator\\reduce.js",
      "rxjs/operator/repeat": __dirname + "\\node_modules\\rxjs\\_esm5\\operator\\repeat.js",
      "rxjs/operator/repeatWhen": __dirname + "\\node_modules\\rxjs\\_esm5\\operator\\repeatWhen.js",
      "rxjs/operator/retry": __dirname + "\\node_modules\\rxjs\\_esm5\\operator\\retry.js",
      "rxjs/operator/retryWhen": __dirname + "\\node_modules\\rxjs\\_esm5\\operator\\retryWhen.js",
      "rxjs/operator/sample": __dirname + "\\node_modules\\rxjs\\_esm5\\operator\\sample.js",
      "rxjs/operator/sampleTime": __dirname + "\\node_modules\\rxjs\\_esm5\\operator\\sampleTime.js",
      "rxjs/operator/scan": __dirname + "\\node_modules\\rxjs\\_esm5\\operator\\scan.js",
      "rxjs/operator/sequenceEqual": __dirname + "\\node_modules\\rxjs\\_esm5\\operator\\sequenceEqual.js",
      "rxjs/operator/share": __dirname + "\\node_modules\\rxjs\\_esm5\\operator\\share.js",
      "rxjs/operator/shareReplay": __dirname + "\\node_modules\\rxjs\\_esm5\\operator\\shareReplay.js",
      "rxjs/operator/single": __dirname + "\\node_modules\\rxjs\\_esm5\\operator\\single.js",
      "rxjs/operator/skip": __dirname + "\\node_modules\\rxjs\\_esm5\\operator\\skip.js",
      "rxjs/operator/skipLast": __dirname + "\\node_modules\\rxjs\\_esm5\\operator\\skipLast.js",
      "rxjs/operator/skipUntil": __dirname + "\\node_modules\\rxjs\\_esm5\\operator\\skipUntil.js",
      "rxjs/operator/skipWhile": __dirname + "\\node_modules\\rxjs\\_esm5\\operator\\skipWhile.js",
      "rxjs/operator/startWith": __dirname + "\\node_modules\\rxjs\\_esm5\\operator\\startWith.js",
      "rxjs/operator/subscribeOn": __dirname + "\\node_modules\\rxjs\\_esm5\\operator\\subscribeOn.js",
      "rxjs/operator/switch": __dirname + "\\node_modules\\rxjs\\_esm5\\operator\\switch.js",
      "rxjs/operator/switchMap": __dirname + "\\node_modules\\rxjs\\_esm5\\operator\\switchMap.js",
      "rxjs/operator/switchMapTo": __dirname + "\\node_modules\\rxjs\\_esm5\\operator\\switchMapTo.js",
      "rxjs/operator/take": __dirname + "\\node_modules\\rxjs\\_esm5\\operator\\take.js",
      "rxjs/operator/takeLast": __dirname + "\\node_modules\\rxjs\\_esm5\\operator\\takeLast.js",
      "rxjs/operator/takeUntil": __dirname + "\\node_modules\\rxjs\\_esm5\\operator\\takeUntil.js",
      "rxjs/operator/takeWhile": __dirname + "\\node_modules\\rxjs\\_esm5\\operator\\takeWhile.js",
      "rxjs/operator/throttle": __dirname + "\\node_modules\\rxjs\\_esm5\\operator\\throttle.js",
      "rxjs/operator/throttleTime": __dirname + "\\node_modules\\rxjs\\_esm5\\operator\\throttleTime.js",
      "rxjs/operator/timeInterval": __dirname + "\\node_modules\\rxjs\\_esm5\\operator\\timeInterval.js",
      "rxjs/operator/timeout": __dirname + "\\node_modules\\rxjs\\_esm5\\operator\\timeout.js",
      "rxjs/operator/timeoutWith": __dirname + "\\node_modules\\rxjs\\_esm5\\operator\\timeoutWith.js",
      "rxjs/operator/timestamp": __dirname + "\\node_modules\\rxjs\\_esm5\\operator\\timestamp.js",
      "rxjs/operator/toArray": __dirname + "\\node_modules\\rxjs\\_esm5\\operator\\toArray.js",
      "rxjs/operator/toPromise": __dirname + "\\node_modules\\rxjs\\_esm5\\operator\\toPromise.js",
      "rxjs/operator/window": __dirname + "\\node_modules\\rxjs\\_esm5\\operator\\window.js",
      "rxjs/operator/windowCount": __dirname + "\\node_modules\\rxjs\\_esm5\\operator\\windowCount.js",
      "rxjs/operator/windowTime": __dirname + "\\node_modules\\rxjs\\_esm5\\operator\\windowTime.js",
      "rxjs/operator/windowToggle": __dirname + "\\node_modules\\rxjs\\_esm5\\operator\\windowToggle.js",
      "rxjs/operator/windowWhen": __dirname + "\\node_modules\\rxjs\\_esm5\\operator\\windowWhen.js",
      "rxjs/operator/withLatestFrom": __dirname + "\\node_modules\\rxjs\\_esm5\\operator\\withLatestFrom.js",
      "rxjs/operator/zip": __dirname + "\\node_modules\\rxjs\\_esm5\\operator\\zip.js",
      "rxjs/operator/zipAll": __dirname + "\\node_modules\\rxjs\\_esm5\\operator\\zipAll.js",
      "rxjs/operators/audit": __dirname + "\\node_modules\\rxjs\\_esm5\\operators\\audit.js",
      "rxjs/operators/auditTime": __dirname + "\\node_modules\\rxjs\\_esm5\\operators\\auditTime.js",
      "rxjs/operators/buffer": __dirname + "\\node_modules\\rxjs\\_esm5\\operators\\buffer.js",
      "rxjs/operators/bufferCount": __dirname + "\\node_modules\\rxjs\\_esm5\\operators\\bufferCount.js",
      "rxjs/operators/bufferTime": __dirname + "\\node_modules\\rxjs\\_esm5\\operators\\bufferTime.js",
      "rxjs/operators/bufferToggle": __dirname + "\\node_modules\\rxjs\\_esm5\\operators\\bufferToggle.js",
      "rxjs/operators/bufferWhen": __dirname + "\\node_modules\\rxjs\\_esm5\\operators\\bufferWhen.js",
      "rxjs/operators/catchError": __dirname + "\\node_modules\\rxjs\\_esm5\\operators\\catchError.js",
      "rxjs/operators/combineAll": __dirname + "\\node_modules\\rxjs\\_esm5\\operators\\combineAll.js",
      "rxjs/operators/combineLatest": __dirname + "\\node_modules\\rxjs\\_esm5\\operators\\combineLatest.js",
      "rxjs/operators/concat": __dirname + "\\node_modules\\rxjs\\_esm5\\operators\\concat.js",
      "rxjs/operators/concatAll": __dirname + "\\node_modules\\rxjs\\_esm5\\operators\\concatAll.js",
      "rxjs/operators/concatMap": __dirname + "\\node_modules\\rxjs\\_esm5\\operators\\concatMap.js",
      "rxjs/operators/concatMapTo": __dirname + "\\node_modules\\rxjs\\_esm5\\operators\\concatMapTo.js",
      "rxjs/operators/count": __dirname + "\\node_modules\\rxjs\\_esm5\\operators\\count.js",
      "rxjs/operators/debounce": __dirname + "\\node_modules\\rxjs\\_esm5\\operators\\debounce.js",
      "rxjs/operators/debounceTime": __dirname + "\\node_modules\\rxjs\\_esm5\\operators\\debounceTime.js",
      "rxjs/operators/defaultIfEmpty": __dirname + "\\node_modules\\rxjs\\_esm5\\operators\\defaultIfEmpty.js",
      "rxjs/operators/delay": __dirname + "\\node_modules\\rxjs\\_esm5\\operators\\delay.js",
      "rxjs/operators/delayWhen": __dirname + "\\node_modules\\rxjs\\_esm5\\operators\\delayWhen.js",
      "rxjs/operators/dematerialize": __dirname + "\\node_modules\\rxjs\\_esm5\\operators\\dematerialize.js",
      "rxjs/operators/distinct": __dirname + "\\node_modules\\rxjs\\_esm5\\operators\\distinct.js",
      "rxjs/operators/distinctUntilChanged": __dirname + "\\node_modules\\rxjs\\_esm5\\operators\\distinctUntilChanged.js",
      "rxjs/operators/distinctUntilKeyChanged": __dirname + "\\node_modules\\rxjs\\_esm5\\operators\\distinctUntilKeyChanged.js",
      "rxjs/operators/elementAt": __dirname + "\\node_modules\\rxjs\\_esm5\\operators\\elementAt.js",
      "rxjs/operators/every": __dirname + "\\node_modules\\rxjs\\_esm5\\operators\\every.js",
      "rxjs/operators/exhaust": __dirname + "\\node_modules\\rxjs\\_esm5\\operators\\exhaust.js",
      "rxjs/operators/exhaustMap": __dirname + "\\node_modules\\rxjs\\_esm5\\operators\\exhaustMap.js",
      "rxjs/operators/expand": __dirname + "\\node_modules\\rxjs\\_esm5\\operators\\expand.js",
      "rxjs/operators/filter": __dirname + "\\node_modules\\rxjs\\_esm5\\operators\\filter.js",
      "rxjs/operators/finalize": __dirname + "\\node_modules\\rxjs\\_esm5\\operators\\finalize.js",
      "rxjs/operators/find": __dirname + "\\node_modules\\rxjs\\_esm5\\operators\\find.js",
      "rxjs/operators/findIndex": __dirname + "\\node_modules\\rxjs\\_esm5\\operators\\findIndex.js",
      "rxjs/operators/first": __dirname + "\\node_modules\\rxjs\\_esm5\\operators\\first.js",
      "rxjs/operators/groupBy": __dirname + "\\node_modules\\rxjs\\_esm5\\operators\\groupBy.js",
      "rxjs/operators/ignoreElements": __dirname + "\\node_modules\\rxjs\\_esm5\\operators\\ignoreElements.js",
      "rxjs/operators/index": __dirname + "\\node_modules\\rxjs\\_esm5\\operators\\index.js",
      "rxjs/operators/isEmpty": __dirname + "\\node_modules\\rxjs\\_esm5\\operators\\isEmpty.js",
      "rxjs/operators/last": __dirname + "\\node_modules\\rxjs\\_esm5\\operators\\last.js",
      "rxjs/operators/map": __dirname + "\\node_modules\\rxjs\\_esm5\\operators\\map.js",
      "rxjs/operators/mapTo": __dirname + "\\node_modules\\rxjs\\_esm5\\operators\\mapTo.js",
      "rxjs/operators/materialize": __dirname + "\\node_modules\\rxjs\\_esm5\\operators\\materialize.js",
      "rxjs/operators/max": __dirname + "\\node_modules\\rxjs\\_esm5\\operators\\max.js",
      "rxjs/operators/merge": __dirname + "\\node_modules\\rxjs\\_esm5\\operators\\merge.js",
      "rxjs/operators/mergeAll": __dirname + "\\node_modules\\rxjs\\_esm5\\operators\\mergeAll.js",
      "rxjs/operators/mergeMap": __dirname + "\\node_modules\\rxjs\\_esm5\\operators\\mergeMap.js",
      "rxjs/operators/mergeMapTo": __dirname + "\\node_modules\\rxjs\\_esm5\\operators\\mergeMapTo.js",
      "rxjs/operators/mergeScan": __dirname + "\\node_modules\\rxjs\\_esm5\\operators\\mergeScan.js",
      "rxjs/operators/min": __dirname + "\\node_modules\\rxjs\\_esm5\\operators\\min.js",
      "rxjs/operators/multicast": __dirname + "\\node_modules\\rxjs\\_esm5\\operators\\multicast.js",
      "rxjs/operators/observeOn": __dirname + "\\node_modules\\rxjs\\_esm5\\operators\\observeOn.js",
      "rxjs/operators/onErrorResumeNext": __dirname + "\\node_modules\\rxjs\\_esm5\\operators\\onErrorResumeNext.js",
      "rxjs/operators/pairwise": __dirname + "\\node_modules\\rxjs\\_esm5\\operators\\pairwise.js",
      "rxjs/operators/partition": __dirname + "\\node_modules\\rxjs\\_esm5\\operators\\partition.js",
      "rxjs/operators/pluck": __dirname + "\\node_modules\\rxjs\\_esm5\\operators\\pluck.js",
      "rxjs/operators/publish": __dirname + "\\node_modules\\rxjs\\_esm5\\operators\\publish.js",
      "rxjs/operators/publishBehavior": __dirname + "\\node_modules\\rxjs\\_esm5\\operators\\publishBehavior.js",
      "rxjs/operators/publishLast": __dirname + "\\node_modules\\rxjs\\_esm5\\operators\\publishLast.js",
      "rxjs/operators/publishReplay": __dirname + "\\node_modules\\rxjs\\_esm5\\operators\\publishReplay.js",
      "rxjs/operators/race": __dirname + "\\node_modules\\rxjs\\_esm5\\operators\\race.js",
      "rxjs/operators/reduce": __dirname + "\\node_modules\\rxjs\\_esm5\\operators\\reduce.js",
      "rxjs/operators/refCount": __dirname + "\\node_modules\\rxjs\\_esm5\\operators\\refCount.js",
      "rxjs/operators/repeat": __dirname + "\\node_modules\\rxjs\\_esm5\\operators\\repeat.js",
      "rxjs/operators/repeatWhen": __dirname + "\\node_modules\\rxjs\\_esm5\\operators\\repeatWhen.js",
      "rxjs/operators/retry": __dirname + "\\node_modules\\rxjs\\_esm5\\operators\\retry.js",
      "rxjs/operators/retryWhen": __dirname + "\\node_modules\\rxjs\\_esm5\\operators\\retryWhen.js",
      "rxjs/operators/sample": __dirname + "\\node_modules\\rxjs\\_esm5\\operators\\sample.js",
      "rxjs/operators/sampleTime": __dirname + "\\node_modules\\rxjs\\_esm5\\operators\\sampleTime.js",
      "rxjs/operators/scan": __dirname + "\\node_modules\\rxjs\\_esm5\\operators\\scan.js",
      "rxjs/operators/sequenceEqual": __dirname + "\\node_modules\\rxjs\\_esm5\\operators\\sequenceEqual.js",
      "rxjs/operators/share": __dirname + "\\node_modules\\rxjs\\_esm5\\operators\\share.js",
      "rxjs/operators/shareReplay": __dirname + "\\node_modules\\rxjs\\_esm5\\operators\\shareReplay.js",
      "rxjs/operators/single": __dirname + "\\node_modules\\rxjs\\_esm5\\operators\\single.js",
      "rxjs/operators/skip": __dirname + "\\node_modules\\rxjs\\_esm5\\operators\\skip.js",
      "rxjs/operators/skipLast": __dirname + "\\node_modules\\rxjs\\_esm5\\operators\\skipLast.js",
      "rxjs/operators/skipUntil": __dirname + "\\node_modules\\rxjs\\_esm5\\operators\\skipUntil.js",
      "rxjs/operators/skipWhile": __dirname + "\\node_modules\\rxjs\\_esm5\\operators\\skipWhile.js",
      "rxjs/operators/startWith": __dirname + "\\node_modules\\rxjs\\_esm5\\operators\\startWith.js",
      "rxjs/operators/subscribeOn": __dirname + "\\node_modules\\rxjs\\_esm5\\operators\\subscribeOn.js",
      "rxjs/operators/switchAll": __dirname + "\\node_modules\\rxjs\\_esm5\\operators\\switchAll.js",
      "rxjs/operators/switchMap": __dirname + "\\node_modules\\rxjs\\_esm5\\operators\\switchMap.js",
      "rxjs/operators/switchMapTo": __dirname + "\\node_modules\\rxjs\\_esm5\\operators\\switchMapTo.js",
      "rxjs/operators/take": __dirname + "\\node_modules\\rxjs\\_esm5\\operators\\take.js",
      "rxjs/operators/takeLast": __dirname + "\\node_modules\\rxjs\\_esm5\\operators\\takeLast.js",
      "rxjs/operators/takeUntil": __dirname + "\\node_modules\\rxjs\\_esm5\\operators\\takeUntil.js",
      "rxjs/operators/takeWhile": __dirname + "\\node_modules\\rxjs\\_esm5\\operators\\takeWhile.js",
      "rxjs/operators/tap": __dirname + "\\node_modules\\rxjs\\_esm5\\operators\\tap.js",
      "rxjs/operators/throttle": __dirname + "\\node_modules\\rxjs\\_esm5\\operators\\throttle.js",
      "rxjs/operators/throttleTime": __dirname + "\\node_modules\\rxjs\\_esm5\\operators\\throttleTime.js",
      "rxjs/operators/timeInterval": __dirname + "\\node_modules\\rxjs\\_esm5\\operators\\timeInterval.js",
      "rxjs/operators/timeout": __dirname + "\\node_modules\\rxjs\\_esm5\\operators\\timeout.js",
      "rxjs/operators/timeoutWith": __dirname + "\\node_modules\\rxjs\\_esm5\\operators\\timeoutWith.js",
      "rxjs/operators/timestamp": __dirname + "\\node_modules\\rxjs\\_esm5\\operators\\timestamp.js",
      "rxjs/operators/toArray": __dirname + "\\node_modules\\rxjs\\_esm5\\operators\\toArray.js",
      "rxjs/operators/window": __dirname + "\\node_modules\\rxjs\\_esm5\\operators\\window.js",
      "rxjs/operators/windowCount": __dirname + "\\node_modules\\rxjs\\_esm5\\operators\\windowCount.js",
      "rxjs/operators/windowTime": __dirname + "\\node_modules\\rxjs\\_esm5\\operators\\windowTime.js",
      "rxjs/operators/windowToggle": __dirname + "\\node_modules\\rxjs\\_esm5\\operators\\windowToggle.js",
      "rxjs/operators/windowWhen": __dirname + "\\node_modules\\rxjs\\_esm5\\operators\\windowWhen.js",
      "rxjs/operators/withLatestFrom": __dirname + "\\node_modules\\rxjs\\_esm5\\operators\\withLatestFrom.js",
      "rxjs/operators/zip": __dirname + "\\node_modules\\rxjs\\_esm5\\operators\\zip.js",
      "rxjs/operators/zipAll": __dirname + "\\node_modules\\rxjs\\_esm5\\operators\\zipAll.js",
      "rxjs/scheduler/Action": __dirname + "\\node_modules\\rxjs\\_esm5\\scheduler\\Action.js",
      "rxjs/scheduler/AnimationFrameAction": __dirname + "\\node_modules\\rxjs\\_esm5\\scheduler\\AnimationFrameAction.js",
      "rxjs/scheduler/AnimationFrameScheduler": __dirname + "\\node_modules\\rxjs\\_esm5\\scheduler\\AnimationFrameScheduler.js",
      "rxjs/scheduler/AsapAction": __dirname + "\\node_modules\\rxjs\\_esm5\\scheduler\\AsapAction.js",
      "rxjs/scheduler/AsapScheduler": __dirname + "\\node_modules\\rxjs\\_esm5\\scheduler\\AsapScheduler.js",
      "rxjs/scheduler/AsyncAction": __dirname + "\\node_modules\\rxjs\\_esm5\\scheduler\\AsyncAction.js",
      "rxjs/scheduler/AsyncScheduler": __dirname + "\\node_modules\\rxjs\\_esm5\\scheduler\\AsyncScheduler.js",
      "rxjs/scheduler/QueueAction": __dirname + "\\node_modules\\rxjs\\_esm5\\scheduler\\QueueAction.js",
      "rxjs/scheduler/QueueScheduler": __dirname + "\\node_modules\\rxjs\\_esm5\\scheduler\\QueueScheduler.js",
      "rxjs/scheduler/VirtualTimeScheduler": __dirname + "\\node_modules\\rxjs\\_esm5\\scheduler\\VirtualTimeScheduler.js",
      "rxjs/scheduler/animationFrame": __dirname + "\\node_modules\\rxjs\\_esm5\\scheduler\\animationFrame.js",
      "rxjs/scheduler/asap": __dirname + "\\node_modules\\rxjs\\_esm5\\scheduler\\asap.js",
      "rxjs/scheduler/async": __dirname + "\\node_modules\\rxjs\\_esm5\\scheduler\\async.js",
      "rxjs/scheduler/queue": __dirname + "\\node_modules\\rxjs\\_esm5\\scheduler\\queue.js",
      "rxjs/symbol/iterator": __dirname + "\\node_modules\\rxjs\\_esm5\\symbol\\iterator.js",
      "rxjs/symbol/observable": __dirname + "\\node_modules\\rxjs\\_esm5\\symbol\\observable.js",
      "rxjs/symbol/rxSubscriber": __dirname + "\\node_modules\\rxjs\\_esm5\\symbol\\rxSubscriber.js",
      "rxjs/testing/ColdObservable": __dirname + "\\node_modules\\rxjs\\_esm5\\testing\\ColdObservable.js",
      "rxjs/testing/HotObservable": __dirname + "\\node_modules\\rxjs\\_esm5\\testing\\HotObservable.js",
      "rxjs/testing/SubscriptionLog": __dirname + "\\node_modules\\rxjs\\_esm5\\testing\\SubscriptionLog.js",
      "rxjs/testing/SubscriptionLoggable": __dirname + "\\node_modules\\rxjs\\_esm5\\testing\\SubscriptionLoggable.js",
      "rxjs/testing/TestMessage": __dirname + "\\node_modules\\rxjs\\_esm5\\testing\\TestMessage.js",
      "rxjs/testing/TestScheduler": __dirname + "\\node_modules\\rxjs\\_esm5\\testing\\TestScheduler.js",
      "rxjs/util/AnimationFrame": __dirname + "\\node_modules\\rxjs\\_esm5\\util\\AnimationFrame.js",
      "rxjs/util/ArgumentOutOfRangeError": __dirname + "\\node_modules\\rxjs\\_esm5\\util\\ArgumentOutOfRangeError.js",
      "rxjs/util/EmptyError": __dirname + "\\node_modules\\rxjs\\_esm5\\util\\EmptyError.js",
      "rxjs/util/FastMap": __dirname + "\\node_modules\\rxjs\\_esm5\\util\\FastMap.js",
      "rxjs/util/Immediate": __dirname + "\\node_modules\\rxjs\\_esm5\\util\\Immediate.js",
      "rxjs/util/Map": __dirname + "\\node_modules\\rxjs\\_esm5\\util\\Map.js",
      "rxjs/util/MapPolyfill": __dirname + "\\node_modules\\rxjs\\_esm5\\util\\MapPolyfill.js",
      "rxjs/util/ObjectUnsubscribedError": __dirname + "\\node_modules\\rxjs\\_esm5\\util\\ObjectUnsubscribedError.js",
      "rxjs/util/Set": __dirname + "\\node_modules\\rxjs\\_esm5\\util\\Set.js",
      "rxjs/util/TimeoutError": __dirname + "\\node_modules\\rxjs\\_esm5\\util\\TimeoutError.js",
      "rxjs/util/UnsubscriptionError": __dirname + "\\node_modules\\rxjs\\_esm5\\util\\UnsubscriptionError.js",
      "rxjs/util/applyMixins": __dirname + "\\node_modules\\rxjs\\_esm5\\util\\applyMixins.js",
      "rxjs/util/assign": __dirname + "\\node_modules\\rxjs\\_esm5\\util\\assign.js",
      "rxjs/util/errorObject": __dirname + "\\node_modules\\rxjs\\_esm5\\util\\errorObject.js",
      "rxjs/util/identity": __dirname + "\\node_modules\\rxjs\\_esm5\\util\\identity.js",
      "rxjs/util/isArray": __dirname + "\\node_modules\\rxjs\\_esm5\\util\\isArray.js",
      "rxjs/util/isArrayLike": __dirname + "\\node_modules\\rxjs\\_esm5\\util\\isArrayLike.js",
      "rxjs/util/isDate": __dirname + "\\node_modules\\rxjs\\_esm5\\util\\isDate.js",
      "rxjs/util/isFunction": __dirname + "\\node_modules\\rxjs\\_esm5\\util\\isFunction.js",
      "rxjs/util/isNumeric": __dirname + "\\node_modules\\rxjs\\_esm5\\util\\isNumeric.js",
      "rxjs/util/isObject": __dirname + "\\node_modules\\rxjs\\_esm5\\util\\isObject.js",
      "rxjs/util/isPromise": __dirname + "\\node_modules\\rxjs\\_esm5\\util\\isPromise.js",
      "rxjs/util/isScheduler": __dirname + "\\node_modules\\rxjs\\_esm5\\util\\isScheduler.js",
      "rxjs/util/noop": __dirname + "\\node_modules\\rxjs\\_esm5\\util\\noop.js",
      "rxjs/util/not": __dirname + "\\node_modules\\rxjs\\_esm5\\util\\not.js",
      "rxjs/util/pipe": __dirname + "\\node_modules\\rxjs\\_esm5\\util\\pipe.js",
      "rxjs/util/root": __dirname + "\\node_modules\\rxjs\\_esm5\\util\\root.js",
      "rxjs/util/subscribeToResult": __dirname + "\\node_modules\\rxjs\\_esm5\\util\\subscribeToResult.js",
      "rxjs/util/toSubscriber": __dirname + "\\node_modules\\rxjs\\_esm5\\util\\toSubscriber.js",
      "rxjs/util/tryCatch": __dirname + "\\node_modules\\rxjs\\_esm5\\util\\tryCatch.js",
      "rxjs/operators": __dirname + "\\node_modules\\rxjs\\_esm5\\operators\\index.js"
    },
    "mainFields": [
      "browser",
      "module",
      "main"
    ]
  },
  "resolveLoader": {
    "modules": [
      "./node_modules",
      "./node_modules"
    ]
  },
  "entry": {
    "assets/js/main": [
      "./src\\main.ts"
    ],
    "assets/js/polyfills": [
      "./src\\polyfills.ts"
    ],
    "assets/js/styles": [
      "./src\\styles.css",
      "./node_modules\\admin-lte\\dist\\css\\AdminLTE.min.css",
      "./src\\assets\\css\\ng-bootstrap.min.css",
      "./node_modules\\bootstrap\\dist\\css\\bootstrap.css",
      "./node_modules\\font-awesome\\css\\font-awesome.css"
    ]
  },
  "output": {
    "path": path.join(process.cwd(), "dist"),
    "filename": "[name].[hash].bundle.js",
    //"chunkFilename": "[id].chunk.js",
    "crossOriginLoading": false
  },
  "module": {
    "rules": [
      {
        "test": /\.html$/,
        "loader": "raw-loader"
      },
      {
        "test": /\.(woff|woff2|ani|ttf|eot|svg)$/,
        "loader": "url-loader",
        "options": {
          "name": "assets/fonts/[name].[hash:20].[ext]",
          "limit": 10000,
        }
      },
      {
        "test": /\.(jpg|png|webp|ani)$/,
        "loader": "url-loader",
        "options": {
          "name": "assets/img/[name].[hash:20].[ext]",
          "limit": 10000,
        }
      },
      {
        "exclude": [
          path.join(process.cwd(), "src\\styles.css"),
          path.join(process.cwd(), "node_modules\\admin-lte\\dist\\css\\AdminLTE.min.css"),
          path.join(process.cwd(), "src\\assets\\css\\ng-bootstrap.min.css"),
          path.join(process.cwd(), "node_modules\\bootstrap\\dist\\css\\bootstrap.css"),
          path.join(process.cwd(), "node_modules\\font-awesome\\css\\font-awesome.css")
        ],
        "test": /\.css$/,
        "use": [
          "exports-loader?module.exports.toString()",
          {
            "loader": "css-loader",
            "options": {
              "sourceMap": false,
              "importLoaders": 1
            }
          },
          {
            "loader": "postcss-loader",
            "options": {
              "ident": "postcss",
              "plugins": postcssPlugins
            }
          }
        ]
      },
      // {
      //   "exclude": [
      //     path.join(process.cwd(), "src\\styles.css"),
      //     path.join(process.cwd(), "node_modules\\admin-lte\\dist\\css\\AdminLTE.min.css"),
      //     path.join(process.cwd(), "src\\assets\\css\\ng-bootstrap.min.css"),
      //     path.join(process.cwd(), "node_modules\\bootstrap\\dist\\css\\bootstrap.css"),
      //     path.join(process.cwd(), "node_modules\\font-awesome\\css\\font-awesome.css")
      //   ],
      //   "test": /\.scss$|\.sass$/,
      //   "use": [
      //     "exports-loader?module.exports.toString()",
      //     {
      //       "loader": "css-loader",
      //       "options": {
      //         "sourceMap": false,
      //         "importLoaders": 1
      //       }
      //     },
      //     {
      //       "loader": "postcss-loader",
      //       "options": {
      //         "ident": "postcss",
      //         "plugins": postcssPlugins
      //       }
      //     },
      //     {
      //       "loader": "sass-loader",
      //       "options": {
      //         "sourceMap": false,
      //         "precision": 8,
      //         "includePaths": []
      //       }
      //     }
      //   ]
      // },
      // {
      //   "exclude": [
      //     path.join(process.cwd(), "src\\styles.css"),
      //     path.join(process.cwd(), "node_modules\\admin-lte\\dist\\css\\AdminLTE.min.css"),
      //     path.join(process.cwd(), "src\\assets\\css\\ng-bootstrap.min.css"),
      //     path.join(process.cwd(), "node_modules\\bootstrap\\dist\\css\\bootstrap.css"),
      //     path.join(process.cwd(), "node_modules\\font-awesome\\css\\font-awesome.css")
      //   ],
      //   "test": /\.less$/,
      //   "use": [
      //     "exports-loader?module.exports.toString()",
      //     {
      //       "loader": "css-loader",
      //       "options": {
      //         "sourceMap": false,
      //         "importLoaders": 1
      //       }
      //     },
      //     {
      //       "loader": "postcss-loader",
      //       "options": {
      //         "ident": "postcss",
      //         "plugins": postcssPlugins
      //       }
      //     },
      //     {
      //       "loader": "less-loader",
      //       "options": {
      //         "sourceMap": false
      //       }
      //     }
      //   ]
      // },
      // {
      //   "exclude": [
      //     path.join(process.cwd(), "src\\styles.css"),
      //     path.join(process.cwd(), "node_modules\\admin-lte\\dist\\css\\AdminLTE.min.css"),
      //     path.join(process.cwd(), "src\\assets\\css\\ng-bootstrap.min.css"),
      //     path.join(process.cwd(), "node_modules\\bootstrap\\dist\\css\\bootstrap.css"),
      //     path.join(process.cwd(), "node_modules\\font-awesome\\css\\font-awesome.css")
      //   ],
      //   "test": /\.styl$/,
      //   "use": [
      //     "exports-loader?module.exports.toString()",
      //     {
      //       "loader": "css-loader",
      //       "options": {
      //         "sourceMap": false,
      //         "importLoaders": 1
      //       }
      //     },
      //     {
      //       "loader": "postcss-loader",
      //       "options": {
      //         "ident": "postcss",
      //         "plugins": postcssPlugins
      //       }
      //     },
      //     {
      //       "loader": "stylus-loader",
      //       "options": {
      //         "sourceMap": false,
      //         "paths": []
      //       }
      //     }
      //   ]
      // },
      {
        "include": [
          path.join(process.cwd(), "src\\styles.css"),
          path.join(process.cwd(), "node_modules\\admin-lte\\dist\\css\\AdminLTE.min.css"),
          path.join(process.cwd(), "src\\assets\\css\\ng-bootstrap.min.css"),
          path.join(process.cwd(), "node_modules\\bootstrap\\dist\\css\\bootstrap.css"),
          path.join(process.cwd(), "node_modules\\font-awesome\\css\\font-awesome.css")
        ],
        "test": /\.css$/,
        "use": [
          "style-loader",
          {
            "loader": "css-loader",
            "options": {
              "sourceMap": false,
              "importLoaders": 1
            }
          },
          {
            "loader": "postcss-loader",
            "options": {
              "ident": "postcss",
              "plugins": postcssPlugins
            }
          }
        ]
      },
      // {
      //   "include": [
      //     path.join(process.cwd(), "src\\styles.css"),
      //     path.join(process.cwd(), "node_modules\\admin-lte\\dist\\css\\AdminLTE.min.css"),
      //     path.join(process.cwd(), "src\\assets\\css\\ng-bootstrap.min.css"),
      //     path.join(process.cwd(), "node_modules\\bootstrap\\dist\\css\\bootstrap.css"),
      //     path.join(process.cwd(), "node_modules\\font-awesome\\css\\font-awesome.css")
      //   ],
      //   "test": /\.scss$|\.sass$/,
      //   "use": [
      //     "style-loader",
      //     {
      //       "loader": "css-loader",
      //       "options": {
      //         "sourceMap": false,
      //         "importLoaders": 1
      //       }
      //     },
      //     {
      //       "loader": "postcss-loader",
      //       "options": {
      //         "ident": "postcss",
      //         "plugins": postcssPlugins
      //       }
      //     },
      //     {
      //       "loader": "sass-loader",
      //       "options": {
      //         "sourceMap": false,
      //         "precision": 8,
      //         "includePaths": []
      //       }
      //     }
      //   ]
      // },
      // {
      //   "include": [
      //     path.join(process.cwd(), "src\\styles.css"),
      //     path.join(process.cwd(), "node_modules\\admin-lte\\dist\\css\\AdminLTE.min.css"),
      //     path.join(process.cwd(), "src\\assets\\css\\ng-bootstrap.min.css"),
      //     path.join(process.cwd(), "node_modules\\bootstrap\\dist\\css\\bootstrap.css"),
      //     path.join(process.cwd(), "node_modules\\font-awesome\\css\\font-awesome.css")
      //   ],
      //   "test": /\.less$/,
      //   "use": [
      //     "style-loader",
      //     {
      //       "loader": "css-loader",
      //       "options": {
      //         "sourceMap": false,
      //         "importLoaders": 1
      //       }
      //     },
      //     {
      //       "loader": "postcss-loader",
      //       "options": {
      //         "ident": "postcss",
      //         "plugins": postcssPlugins
      //       }
      //     },
      //     {
      //       "loader": "less-loader",
      //       "options": {
      //         "sourceMap": false
      //       }
      //     }
      //   ]
      // },
      // {
      //   "include": [
      //     path.join(process.cwd(), "src\\styles.css"),
      //     path.join(process.cwd(), "node_modules\\admin-lte\\dist\\css\\AdminLTE.min.css"),
      //     path.join(process.cwd(), "src\\assets\\css\\ng-bootstrap.min.css"),
      //     path.join(process.cwd(), "node_modules\\bootstrap\\dist\\css\\bootstrap.css"),
      //     path.join(process.cwd(), "node_modules\\font-awesome\\css\\font-awesome.css")
      //   ],
      //   "test": /\.styl$/,
      //   "use": [
      //     "style-loader",
      //     {
      //       "loader": "css-loader",
      //       "options": {
      //         "sourceMap": false,
      //         "importLoaders": 1
      //       }
      //     },
      //     {
      //       "loader": "postcss-loader",
      //       "options": {
      //         "ident": "postcss",
      //         "plugins": postcssPlugins
      //       }
      //     },
      //     {
      //       "loader": "stylus-loader",
      //       "options": {
      //         "sourceMap": false,
      //         "paths": []
      //       }
      //     }
      //   ]
      // },
      {
        "test": /\.ts$/,
        "loader": "@ngtools/webpack"
      }
    ]
  },
  "plugins": [
    new CleanWebpackPlugin(['dist']),
    new ProgressPlugin(),
    new LoaderOptionsPlugin({
      minimize: true,
      debug: false
    }),
    new ModuleConcatenationPlugin(),
    new UglifyJsPlugin({
      sourceMap: true
    }),
    new NoEmitOnErrorsPlugin(),
    new ConcatPlugin({
      "uglify": false,
      "sourceMap": true,
      "name": "scripts",
      "fileName": "[name].[hash].bundle.js",
      "filesToConcat": [
        "node_modules\\jquery\\dist\\jquery.min.js",
        "node_modules\\bootstrap\\dist\\js\\bootstrap.min.js",
        "node_modules\\admin-lte\\dist\\js\\AdminLTE.min.js"
      ]
    }),
    new InsertConcatAssetsWebpackPlugin([
      "scripts"
    ]),
    new CopyWebpackPlugin([
      {
        "context": "src\\assets",
        "to": "./assets/",
        "from": {
          "glob": "**/*",
          "dot": true
        }
      },
      {
        "context": "src\\favicon.ico",
        "to": "./favicon.ico",
        "from": {
          "glob": "favicon.ico",
          "dot": true
        }
      },
      {
        "context": "src\\images",
        "to": "./images",
        "from": {
          "glob": "**/*",
          "dot": true
        }
      },
    ], {
        "ignore": [
          ".gitkeep"
        ],
        "debug": "warning"
      }),
    new CircularDependencyPlugin({
      "exclude": /(\\|\/)node_modules(\\|\/)/,
      "failOnError": false
    }),
    new NamedLazyChunksWebpackPlugin(),
    new HtmlWebpackPlugin({
      "template": "./src\\index.html",
      "filename": "./index.html",
      "hash": false,
      "inject": true,
      "compile": true,
      "favicon": false,
      "minify": false,
      "cache": true,
      "showErrors": true,
      "chunks": "all",
      "excludeChunks": [],
      "title": "Webpack App",
      "xhtml": true,
      "chunksSortMode": function sort(left, right) {
        let leftIndex = entryPoints.indexOf(left.names[0]);
        let rightindex = entryPoints.indexOf(right.names[0]);
        if (leftIndex > rightindex) {
          return 1;
        }
        else if (leftIndex < rightindex) {
          return -1;
        }
        else {
          return 0;
        }
      }
    }),
    new BaseHrefWebpackPlugin({}),
    new CommonsChunkPlugin({
      "name": [
        "inline"
      ],
      "minChunks": null
    }),
    new CommonsChunkPlugin({
      "name": [
        "vendor"
      ],
      "minChunks": (module) => {
        return module.resource
          && (module.resource.startsWith(nodeModules)
            || module.resource.startsWith(genDirNodeModules)
            || module.resource.startsWith(realNodeModules));
      },
      "chunks": [
        "main"
      ]
    }),
    new SourceMapDevToolPlugin({
      "filename": "[file].map[query]",
      "moduleFilenameTemplate": "[resource-path]",
      "fallbackModuleFilenameTemplate": "[resource-path]?[hash]",
      "sourceRoot": "webpack:///"
    }),
    new CommonsChunkPlugin({
      "name": [
        "main"
      ],
      "minChunks": 2,
      "async": "common"
    }),
    new NamedModulesPlugin({}),
    new AngularCompilerPlugin({
      "mainPath": "main.ts",
      "platform": 0,
      "hostReplacementPaths": {
        "environments\\environment.ts": "environments\\environment.prod.ts"
      },
      "sourceMap": true,
      "tsConfigPath": "src\\tsconfig.app.json",
      "skipCodeGeneration": true,
      "compilerOptions": {}
    })
  ],
  "node": {
    "fs": "empty",
    "global": true,
    "crypto": "empty",
    "tls": "empty",
    "net": "empty",
    "process": true,
    "module": false,
    "clearImmediate": false,
    "setImmediate": false
  },
  "devServer": {
    "historyApiFallback": true
  }
};
