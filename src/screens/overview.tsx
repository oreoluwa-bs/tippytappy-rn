import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { RootStackParamList } from '../navigation';
import WebView from 'react-native-webview';
import { useState } from 'react';
import { FlatList } from 'react-native-gesture-handler';

type OverviewScreenNavigationProps = StackNavigationProp<RootStackParamList, 'Overview'>;

export default function Overview() {
  const navigation = useNavigation<OverviewScreenNavigationProps>();
  const [messages, setMessages] = useState<{ from: string; to: string; message: string }[]>([]);
  const [html, setHTML] = useState<string>('');

  return (
    <View style={styles.container}>
      <View style={styles.main}>
        <View style={[{ flex: 1 }]}>
          {/* <Text>{html}</Text> */}
          <FlatList
            data={messages}
            renderItem={({ index, item, separators }) => {
              // console.log(item.message);
              return (
                <View key={index} style={{ height: 100 }}>
                  {/* <Text>
                    {item.from}
                    {': '}
                    {item.message}
                  </Text> */}
                  <WebView
                    // style={{ flex: 1 }}
                    originWhitelist={['*']}
                    source={{
                      html: `
                  <!DOCTYPE html>
                  <html>
                  <head>
                    <meta charset="utf-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                  </head>
                  <style>
                    html,body {
                      font-family: sans-serif;
                    }
        
                    *,*::before,*::after{
                      box-sizing:border-box;
                    }
                    
        
                    .tiptap p.is-editor-empty:first-child::before {
                      color: #adb5bd;
                      content: attr(data-placeholder);
                      float: left;
                      height: 0;
                      pointer-events: none;
                    }
                  </style>
                  <body>
                    <div class="element"></div>
                    <script type="module">
                      import { Editor } from 'https://esm.sh/@tiptap/core'
                      import StarterKit from 'https://esm.sh/@tiptap/starter-kit'
                      import Placeholder from 'https://esm.sh/@tiptap/extension-placeholder'
                      const editor = new Editor({
                        element: document.querySelector('.element'),
                        extensions: [
                          StarterKit,
                          Placeholder.configure({
                            placeholder: "What's on your mind?",
                          }),
                        ],
                        content: "${item.message}",
                        editable: false,
                        onUpdate({editor}){
                          const html = editor.getHTML()
                          window.ReactNativeWebView.postMessage(JSON.stringify({type:"update",data:html}));
                        }
                      })
                    </script>
                  </body>
                  </html>
                  `,
                    }}
                    onMessage={(event) => {
                      const ev = JSON.parse(event.nativeEvent.data);
                      switch (ev.type) {
                        case 'update':
                          setHTML(ev.data);
                          break;

                        default:
                          console.log(ev);
                          break;
                      }
                    }}
                    hideKeyboardAccessoryView
                  />
                </View>
              );
            }}
          />
        </View>
        <View style={[{ height: 150 }]}>
          <WebView
            style={{ flex: 1 }}
            originWhitelist={['*']}
            source={{
              html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <style>
            html,body {
              font-family: sans-serif;
            }

            *,*::before,*::after{
              box-sizing:border-box;
            }
            

            .tiptap p.is-editor-empty:first-child::before {
              color: #adb5bd;
              content: attr(data-placeholder);
              float: left;
              height: 0;
              pointer-events: none;
            }
          </style>
          <body>
            <div class="element"></div>
            <script type="module">
              import { Editor } from 'https://esm.sh/@tiptap/core'
              import StarterKit from 'https://esm.sh/@tiptap/starter-kit'
              import Placeholder from 'https://esm.sh/@tiptap/extension-placeholder'
              const editor = new Editor({
                element: document.querySelector('.element'),
                extensions: [
                  StarterKit,
                  Placeholder.configure({
                    placeholder: "What's on your mind?",
                  }),
                ],
                content: '',
                onUpdate({editor}){
                  const html = editor.getHTML()
                  window.ReactNativeWebView.postMessage(JSON.stringify({type:"update",data:html}));
                }
              })
            </script>
          </body>
          </html>
          `,
            }}
            onMessage={(event) => {
              const ev = JSON.parse(event.nativeEvent.data);
              switch (ev.type) {
                case 'update':
                  setHTML(ev.data);
                  break;

                default:
                  console.log(ev);
                  break;
              }
            }}
            hideKeyboardAccessoryView
          />
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              // send message
              setMessages((prev) => [...prev, { from: 'You', to: 'Computer', message: html }]);
            }}>
            <Text style={styles.buttonText}>Send</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: '#6366F1',
    borderRadius: 24,
    elevation: 5,
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      height: 2,
      width: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  container: {
    flex: 1,
    padding: 24,
  },
  main: {
    flex: 1,
    maxWidth: 960,
    marginHorizontal: 'auto',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 64,
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#38434D',
    fontSize: 36,
  },
});
