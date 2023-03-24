<template>
  <div class="chat-container">
    <el-row>
      <el-col :span="24">
        <div class="chat-title">
          <h1>WebSocket Chat Room</h1>
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="16">
        <div class="chat-window">
          <div v-for="(message, index) in messages" :key="index">
            <p v-if="message.type === 'system'">
              {{ message.text }}
            </p>
            <div class="chat-bubble" :class="{ 'is-me': message.isMe }">
              <div class="bubble-content">
                <p>{{ message.content }}</p>
              </div>
              <div class="bubble-author">
                <span>{{ message.author }}</span>
                <span>{{ message.time }}</span>
              </div>
            </div>
          </div>
        </div>
        <el-input v-model="inputMessage" placeholder="Type your message..." @keyup.enter.native="sendMessage">
        </el-input>
      </el-col>
      <el-col :span="8">
        <div class="user-list">
          <el-card>
            <p slot="header" class="user-list-title">Online Users ({{ userCount }})</p>
            <el-scrollbar>
              <el-row v-for="(user, index) in userList" :key="index">
                <el-col :span="24">
                  <p>{{ user }}</p>
                </el-col>
              </el-row>
            </el-scrollbar>
          </el-card>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import {
    mapGetters
  } from 'vuex';

  import {
    Message
  } from 'element-ui';
  import WebSocket from 'ws';

  export default {

    data() {
      return {
        inputMessage: '',
        messages: [],
        userList: [],
        userCount: 0,
        ws: null,
      };
    },
    mounted() {
      this.initWebSocket();
    },
    methods: {
      initWebSocket() {
        this.ws = new WebSocket('ws://localhost:3000');

        this.ws.onopen = (event) => {
          console.log('WebSocket connected', event);
        };

        this.ws.onmessage = (event) => {
          const data = JSON.parse(event.data);
          console.log('WebSocket message', data);

          if (data.type === 'message') {
            this.messages.push(data);
            this.$nextTick(() => {
              const chatWindow = this.$el.querySelector('.chat-window');
              chatWindow.scrollTop = chatWindow.scrollHeight;
            });
          } else if (data.type === 'system') {
            this.userCount = data.userCount;
            this.userList = data.userList;
            this.messages.push(data);
          }
        };

        this.ws.onerror = (event) => {
          console.error('WebSocket error', event);
        };

        this.ws.onclose = (event) => {
          console.log('WebSocket closed', event);
        };
      },
      // 在 `sendMessage` 方法中使用 Element UI 的彈出提示
      sendMessage() {
        if (!this.inputMessage) return;

        const message = {
          type: 'message',
          author: this.$store.state.username,
          content: this.inputMessage,
          time: new Date().toLocaleString(),
          isMe: true,
        };

        this.ws.send(JSON.stringify(message));
        this.messages.push(message);
        this.inputMessage = '';
        this.$nextTick(() => {
          const chatWindow = this.$el.querySelector('.chat-window');
          chatWindow.scrollTop = chatWindow.scrollHeight;
        });

        // 彈出提示
        Message.success('Message sent!');
      },
      notifyUserJoined(user) {
        const message = {
          type: 'system',
          text: `${user} joined the chat.`,
        };
        this.messages.push(message);
      },
    },
    computed: {
      ...mapGetters(['loggedIn']),
    },
    watch: {
      loggedIn(newValue) {
        if (newValue) {
          const user = this.$store.state.username;
          this.notifyUserJoined(user);
          const message = {
            type: 'system',
            user,
            text: `${user}joined the chat.`
          };
          this.ws.send(JSON.stringify(message));
        }
      },
    },
  };
</script>
<style scoped lang="scss">
  .chat-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
    box-sizing: border-box;
  }

  .chat-title {
    text-align: center;
    margin-bottom: 30px;

    h1 {
      font-size: 28px;
    }
  }

  .chat-window {
    height: 500px;
    overflow-y: scroll;
    margin-bottom: 20px;
  }

  .chat-bubble {
    display: flex;
    margin-bottom: 10px;
    max-width: 70%;
    margin-left: auto;
    margin-right: auto;
    border-radius: 10px;
    padding: 10px 20px;
    background-color: #e8f4f8;
    box-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);

    &.is-me {
      background-color: #d6eef8;
    }
  }

  .bubble-content {
    flex-grow: 1;
  }

  .bubble-author {
    font-size: 12px;
    color: #999;
    display: flex;
    justify-content: space-between;
  }

  .user-list {
    height: 500px;
    overflow-y: scroll;

    .user-list-title {
      text-align: center;
      font-size: 20px;
      margin-bottom: 10px;
    }
  }
</style>