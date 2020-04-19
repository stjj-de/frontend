<template>
  <div class="post-editor">
    <editor-menu-bar :editor="editor" v-slot="{ commands, isActive }">
      <div class="post-editor__menubar">
        <PostEditorMenubarButton
          title="Fett (Strg+B)"
          :active="isActive.bold()"
          @click="commands.bold"
        >
          <BoldIcon/>
        </PostEditorMenubarButton>
        <PostEditorMenubarButton
          title="Kursiv (Strg+I)"
          :active="isActive.italic()"
          @click="commands.italic"
        >
          <ItalicIcon/>
        </PostEditorMenubarButton>
        <PostEditorMenubarButton
          title="Durchstreichen (Strg+S)"
          :active="isActive.strike()"
          @click="commands.strike"
        >
          <StrikethroughIcon/>
        </PostEditorMenubarButton>
        <PostEditorMenubarButton
          title="Unterstreichen (Strg+U)"
          :active="isActive.underline()"
          @click="commands.underline"
        >
          <UnderlineIcon/>
        </PostEditorMenubarButton>
        <PostEditorMenubarButton
          title="Zitat (Strg+Umschalt+<)"
          :active="isActive.blockquote()"
          @click="commands.blockquote"
        >
          <QuoteIcon/>
        </PostEditorMenubarButton>
        <div class="post-editor__menubar-group">
          <v-select
            class="post-editor__text-type-select"
            :clearable="false"
            :searchable="false"
            :close-on-select="false /* this is inverted, for some reason */"
            :options="textTypeSelectOptions"
            :value="getTextTypeSelectValue(isActive)"
            @input="onTextTypeSelect"
          >
            <template v-slot:option="{ label, value }">
            <span
              class="post-editor--text-type-select-option"
              :class="`post-editor--text-type-select-option--${value}`"
            >
              {{ label }}
            </span>
            </template>
          </v-select>
          <div class="post-editor__menubar-group">
            <PostEditorMenubarButton
              title="Rückgängig (Strg+Z)"
              @click="commands.undo"
            >
              <UndoIcon/>
            </PostEditorMenubarButton>
            <PostEditorMenubarButton
              title="Wiederholen (Strg+Umschalt+Z)"
              @click="commands.redo"
            >
              <RedoIcon/>
            </PostEditorMenubarButton>
          </div>
        </div>
      </div>
    </editor-menu-bar>
    <editor-content class="post-editor__content formatted" :editor="editor"/>
  </div>
</template>

<style lang="scss">
  @use "~@/assets/styles/colors";

  .post-editor__menubar {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    padding: 4px;
    margin-top: 4px;

    border-top-left-radius: 4px;
    border-top-right-radius: 4px;

    & > .post-editor-menubar-button:not(:last-child) {
      margin-right: 5px;
    }
  }

  .post-editor__menubar-group {
    margin-top: 4px;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
  }

  .post-editor__text-type-select {
    width: 200px;
    margin-right: 5px;
    margin-top: 2px;
  }

  .post-editor--text-type-select-option--h1 {
    font-size: 1.3rem;
    font-weight: bold;
  }

  .post-editor--text-type-select-option--h2 {
    font-size: 1.2rem;
    font-weight: bold;
  }

  .post-editor--text-type-select-option--h3 {
    font-size: 1.1rem;
    font-weight: bold;
  }

  .post-editor__content {
    font-size: 1.1rem;

    padding: 10px 20px;
    box-shadow: inset 0 2px 20px 0 transparentize(colors.$background-c, 0.8);

    *:focus {
      outline: none;
    }
  }
</style>

<script>
  import "vue-select/dist/vue-select.css";
  import { Editor, EditorContent, EditorMenuBar } from "tiptap";
  import {
    Blockquote,
    HardBreak,
    Heading,
    OrderedList,
    BulletList,
    ListItem,
    Bold,
    Code,
    Italic,
    Link,
    Strike,
    Underline,
    History
  } from "tiptap-extensions";
  import VSelect from "vue-select";
  import BoldIcon from "@/assets/icons/bold.svg";
  import ItalicIcon from "@/assets/icons/italic.svg";
  import UnderlineIcon from "@/assets/icons/underline.svg";
  import StrikethroughIcon from "@/assets/icons/strikethrough.svg";
  import UndoIcon from "@/assets/icons/undo.svg";
  import RedoIcon from "@/assets/icons/redo.svg";
  import QuoteIcon from "@/assets/icons/quote.svg";
  import PostEditorMenubarButton from "@/components/pages/admin/posts/_id/PostEditorMenubarButton";

  export default {
    name: "PostEditor",
    components: {
      PostEditorMenubarButton, RedoIcon, UndoIcon, QuoteIcon,
      EditorContent, EditorMenuBar, VSelect, BoldIcon, ItalicIcon, UnderlineIcon, StrikethroughIcon
    },
    props: {
      value: {
        type: String,
        required: true
      }
    },
    data() {
      return {
        editor: new Editor({
          extensions: [
            new Blockquote(),
            new BulletList(),
            new HardBreak(),
            new Heading({ levels: [1, 2, 3] }),
            new ListItem(),
            new OrderedList(),
            new Link(),
            new Bold(),
            new Code(),
            new Italic(),
            new Strike(),
            new Underline(),
            new History()
          ],
          content: "<p>Test Test</p>",
          onUpdate: ({ getHTML }) => {
            this.$emit("input", getHTML());
          }
        })
      };
    },
    watch: {
      value: {
        immediate: true,
        handler() {
          this.editor.setContent(this.value);
        }
      }
    },
    computed: {
      textTypeSelectOptions() {
        return [
          {
            label: "Absatz",
            value: "p",
            isActive(isActive) {
              return isActive.paragraph();
            }
          },
          {
            label: "Überschrift 1",
            value: "h1",
            isActive(isActive) {
              return isActive.heading({ level: 1 });
            }
          },
          {
            label: "Überschrift 2",
            value: "h2",
            isActive(isActive) {
              return isActive.heading({ level: 2 });
            }
          },
          {
            label: "Überschrift 3",
            value: "h3",
            isActive(isActive) {
              return isActive.heading({ level: 3 });
            }
          },
          {
            label: "Ungeordnete Liste",
            value: "ul",
            isActive(isActive) {
              return isActive.bullet_list();
            }
          },
          {
            label: "Geordnete Liste",
            value: "ol",
            isActive(isActive) {
              return isActive.ordered_list();
            }
          }
        ];
      }
    },
    beforeDestroy() {
      this.editor.destroy();
    },
    methods: {
      getTextTypeSelectValue(isActive) {
        return this.textTypeSelectOptions.find(option => option.isActive(isActive));
      },
      onTextTypeSelect(option) {
        switch (option.value) {
          case "p": this.editor.commands.paragraph(); break;
          case "h1": this.editor.commands.heading({ level: 1 }); break;
          case "h2": this.editor.commands.heading({ level: 2 }); break;
          case "h3": this.editor.commands.heading({ level: 3 }); break;
          case "ul": this.editor.commands.bullet_list(); break;
          case "ol": this.editor.commands.ordered_list(); break;
        }
      }
    }
  };
</script>
