<template>
    <script :id="id" type="text/plain"  style="width:100%;height:500px;"></script>
</template>

<script>
    export default {
        name: 'UE',
        data() {
            return {
                editor: null
            }
        },
        props: {
            content: {
                type: String,
                default:''
            },
            config: {
                type: Object,
            },
            id: {
                type: String
            }
        },
        created(){
            const _this = this;
            
        },
        mounted(){
            const _this = this;
            
            _this.editor =  UE.getEditor(_this.id, _this.config); // 初始化UE
            _this.editor.addListener("ready", function () {
               _this.editor.setContent(_this.content); // 确保UE加载完成后，放入内容。

               _this.bus.$on('ueditor.child', function (_text) {
                    if(_this.editor!=null&&_text != null)
                      _this.editor.setContent(_text);
               });
            });
            _this.editor.addListener("contentChange", function () {
               _this.bus.$emit('ueditor.text', _this.editor.getContent());
            });
            
        },
        methods: {
            getContent() { // 获取内容方法
                return this.editor.getContent();
            }

        },
        destroyed() {
    　　    this.editor.destroy();
　　    }
    }
</script>