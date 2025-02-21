# Redux-SessionStorage-Simple

The same library as by [Frank Kilkelly](https://github.com/kilkelly/redux-localstorage-simple), but for sessionStorage instead of localStorage.

Save and load Redux state to and from SessionStorage.

## Installation
```sh
npm install --save redux-sessionstorage-simple
```

## Usage Example (ES6 code)

```js
import { applyMiddleware, createStore } from "redux"
import reducer from "./reducer"

// Import the necessary methods for saving and loading
import { save, load } from "redux-sessionstorage-simple"

/*
    Saving to SessionStorage is achieved using Redux 
    middleware. The 'save' method is called by Redux 
    each time an action is handled by your reducer.
*/    
const createStoreWithMiddleware 
    = applyMiddleware(
        save() // Saving done here
    )(createStore)
    
/*
    Loading from SessionStorage happens during
    creation of the Redux store.
*/  
const store = createStoreWithMiddleware(
    reducer,    
    load() // Loading done here
)    
```

## API

### save([Object config])

Saving to SessionStorage is achieved using [Redux middleware](http://redux.js.org/docs/advanced/Middleware.html) and saves each time an action is handled by your reducer. You will need to pass the `save` method into Redux's `applyMiddleware` method, like so...

```js
applyMiddleware(save())
```

See the Usage Example above to get a better idea of how this works.

#### Arguments
The `save` method takes a optional configuration object as an argument. It has the following properties:

```
{
    [Array states],
    [Array ignoreStates]
    [String namespace],
    [String namespaceSeparator],
    [Number debounce],
    [Boolean disableWarnings]
}
```

- states (Array, optional) - This is an optional array of strings specifying which parts of the Redux state tree you want to save to SessionStorage. e.g. ["user", "products"]. Typically states have identical names to your Redux reducers. If you do not specify any states then your entire Redux state tree will be saved to SessionStorage.
- ignoreStates (Array, optional) - This is an optional array of strings specifying which parts of the Redux state tree you do **not** want to save to SessionStorage i.e. ignore. e.g. ["miscUselessInfo1", "miscUselessInfo2"]. Typically states have identical names to your Redux reducers. Unlike the `states` property, `ignoreStates` only works on top-level properties within your state, not nested state as shown in the **Advanced Usage** section below e.g. "miscUselessInfo1" = works, "miscUselessInfo1.innerInfo" = doesn't work.
- namespace (String, optional) - This is an optional string specifying the namespace to add to your SessionStorage items. For example if you have a part of your Redux state tree called "user" and you specify the namespace "my_cool_app", it will be saved to SessionStorage as "my_cool_app_user"
- namespaceSeparator (String, optional) - This is an optional string specifying the separator used between the namespace and the state keys. For example with the namespaceSeparator set to "::", the key saved to the SessionStorage would be "my_cool_app::user"
- debounce (Number, optional) - Debouncing period (in milliseconds) to wait before saving to SessionStorage. Use this as a performance optimization if you feel you are saving to SessionStorage too often. Recommended value: 500 - 1000 milliseconds
- disableWarnings (Boolean, optional) - Any exceptions thrown by SessionStorage will be logged as warnings in the JavaScript console by default, but can be silenced by setting `disableWarnings` to true.

#### Examples

Save entire state tree - EASIEST OPTION.

```js
save()
```

Save specific parts of the state tree.

```js
save({ states: ["user", "products"] })
```

Save entire state tree except the states you want to ignore.

```js
save({ ignoreStates: ["miscUselessInfo1", "miscUselessInfo2"] })
```

Save the entire state tree under the namespace "my_cool_app". The key "my_cool_app" will appear in SessionStorage.

```js
save({ namespace: "my_cool_app" })
```

Save the entire state tree only after a debouncing period of 500 milliseconds has elapsed

```js
save({ debounce: 500 })
```

Save specific parts of the state tree with the namespace "my_cool_app". The keys "my_cool_app_user" and "my_cool_app_products" will appear in SessionStorage.

```js
save({
    states: ["user", "products"],
    namespace: "my_cool_app"
})
```

Save specific parts of the state tree with the namespace "my_cool_app" and the namespace separator "::". The keys "my_cool_app::user" and "my_cool_app::products" will appear in SessionStorage.

```js
save({
    states: ["user", "products"],
    namespace: "my_cool_app",
    namespaceSeparator: "::"
})
```

### load([Object config])
Loading Redux state from SessionStorage happens during creation of the Redux store.

```js
createStore(reducer, load())    
```

See the Usage Example above to get a better idea of how this works.

#### Arguments
The `load` method takes a optional configuration object as an argument. It has the following properties:

```
{
    [Array states],    
    [String namespace],
    [String namespaceSeparator],
    [Object preloadedState],
    [Boolean disableWarnings]
}
```

- states (Array, optional) - This is an optional array of strings specifying which parts of the Redux state tree you want to load from SessionStorage. e.g. ["user", "products"]. These parts of the state tree must have been previously saved using the `save` method. Typically states have identical names to your Redux reducers. If you do not specify any states then your entire Redux state tree will be loaded from SessionStorage.
- namespace (String, optional) - If you have saved your entire state tree or parts of your state tree with a namespace you will need to specify it in order to load it from SessionStorage.
- namespaceSeparator (String, optional) - If you have saved entire state tree or parts of your state tree with a namespaceSeparator, you will need to specify it in order to load it from SessionStorage.
- preloadedState (Object, optional) - Passthrough for the `preloadedState` argument in Redux's `createStore` method. See section **Advanced Usage** below.
- disableWarnings (Boolean, optional) - When you first try to a load a state from SessionStorage you will see a warning in the JavaScript console informing you that this state load is invalid. This is because the `save` method hasn't been called yet and this state has yet to been written to SessionStorage. You may not care to see this warning so to disable it set `disableWarnings` to true. Any exceptions thrown by SessionStorage will also be logged as warnings by default, but can be silenced by setting `disableWarnings` to true.

#### Examples

Load entire state tree - EASIEST OPTION.

```js
load()
```

Load specific parts of the state tree.

```js
load({ states: ["user", "products"] })
```

Load the entire state tree which was previously saved with the namespace "my_cool_app".

```js
load({ namespace: "my_cool_app" })
```

Load specific parts of the state tree which was previously saved with the namespace "my_cool_app".

```js
load({ 
    states: ["user", "products"],
    namespace: "my_cool_app"
})
```

Load specific parts of the state tree which was previously saved with the namespace "my_cool_app" and namespace separator "::".

```js
load({ 
    states: ["user", "products"],
    namespace: "my_cool_app",
    namespaceSeparator: "::"
})
```

### combineLoads(...loads)
If you provided more than one call to `save` in your Redux middleware you will need to use `combineLoads` for a more intricate loading process.

#### Arguments
- loads - This method takes any number of `load` methods as arguments, with each load handling a different part of the state tree. In practice you will provide one `load` method to handle each `save` method provided in your Redux middleware.

#### Example

Load parts of the state tree saved with different namespaces. Here are the `save` methods in your Redux middleware:

```js
applyMiddleware(
    save({ states: ["user"], namespace: "account_stuff" }),
    save({ states: ["products", "categories"], namespace: "site_stuff" })
)
```

The corresponding use of `combineLoads` looks like this:

```js
combineLoads( 
    load({ states: ["user"], namespace: "account_stuff" }),
    load({ states: ["products", "categories"], namespace: "site_stuff" })
)
```

### clear([Object config])

Clears all Redux state tree data from SessionStorage. Note: only clears data which was saved using this module's functionality

#### Arguments

The `clear` method takes a optional configuration object as an argument. It has the following properties:

```
{
    [String namespace],
    [Boolean disableWarnings]
}
```

- namespace - If you have saved your entire state tree or parts of your state tree under a namespace you will need to specify it in order to clear that data from SessionStorage.
- disableWarnings (Boolean, optional) - Any exceptions thrown by SessionStorage will be logged as warnings in the JavaScript console by default, but can be silenced by setting `disableWarnings` to true.

#### Examples

Clear all Redux state tree data saved without a namespace.

```js
clear()
```

Clear Redux state tree data saved with a namespace.

```js
clear({
    namespace: "my_cool_app"
})  
```

## Advanced Usage

In a more complex project you may find that you are saving unnecessary reducer data to SessionStorage and would appreciate a more granular approach. Thankfully there is a way to do this. 

First let's look at a normal example. Let's say you have a reducer called `settings` and its state tree looks like this:

```js
const settingsReducerInitialState = {
    theme: 'light',
    itemsPerPage: 10
}
```

Using `redux-sessionstorage-simple`'s `save()` method for the `settings` reducer would look like this:

```js
save({ states: ["settings"] })
```

This saves all of the `settings` reducer's properties to SessionStorage. But wait, what if we really only care about saving the user's choice of `theme` and not `itemsPerPage`. Here's how to fix this:

```js
save({ states: ["settings.theme"] })
```

This saves only the `theme` setting to SessionStorage. However this presents an additional problem, if `itemsPerPage` is not saved won't my app crash when it can't find it upon loading from SessionStorage?

Yes in most cases it would. So to prevent this you can use the `preloadedState` argument in the `load()` method to provide some initial data.

```js
load({
    states: ["settings.theme"],
    preloadedState: {
        itemsPerPage: 10        
    }
})
```

Also note in the above example that since `settings.theme` was specified in the `load()` method we must also mirror this exactly in the `save()` method. This goes for all states you specify using the granular approach.

So if you have:

`save({ states: ["settings.theme"] })`

You must also have:

`load({ states: ["settings.theme"] })`

## Testing

To run tests for this package open the file 'test/test.html' in your browser. Because this package uses SessionStorage we therefore need to test it in an environment which supports it i.e. modern browsers.

## Feedback

Pull requests and opened issues are welcome!

## License

MIT
