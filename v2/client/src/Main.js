import React, { Component } from 'react';
import axios from 'axios';

import ChatArea from './ChatArea';
import Slides from './Slides';
import { serverURL } from './config';
import './App.scss';

/**
 * The main entrance of the application
 * It consists three main components: App bar, slides on the left, and chat area on the right
 */
class Main extends Component {
    constructor(props) {
        super(props);
        this.fetchChatList = this.fetchChatList.bind(this);
        this.state = { pageNum: 1, questions: [], pageTotal: 1, pageImg: "default.png", };

        let path = window.location.pathname.split("/");
        this.state.id = path.pop();
        if (!this.state.id) this.state.id = path.pop(); // handle URL like /slidechat/slideID/

        axios.get(`${serverURL}/api/pageTotal?slideID=${this.state.id}`).then(data => {
            let currentPage = 1;
            if (window.location.hash) {
                let n = +window.location.hash.substring(1);
                if (n > 0 && n <= data.data.pageTotal) {
                    currentPage = n;
                }
            }
            this.fetchChatList(this.state.id, currentPage);
            this.setState({
                pageTotal: data.data.pageTotal,
                pageNum: currentPage,
                pageImg: `${serverURL}/api/slideImg?slideID=${this.state.id}&pageNum=${currentPage}`
            });
            document.getElementById("pageNum").value = currentPage;
        }).catch(err => {
            console.error(err);
        });

        this.nextPage = this.nextPage.bind(this);
        this.prevPage = this.prevPage.bind(this);
        this.gotoPage = this.gotoPage.bind(this);
    }

    // get chats under a question
    fetchChatList(slideID, pageNum) {
        this.refs.chatArea.setState({ state: "list" });
        axios.get(`${serverURL}/api/questions?slideID=${slideID}&pageNum=${pageNum}`).then(data => {
            this.setState({ questions: data.data });
        }).catch(err => {
            console.error(err);
        });
    }

    /**
     * Go to the next page of slide, should fetch the url and the chat threads list of the new page 
     */
    nextPage() {
        if (this.state.pageNum >= this.state.pageTotal) {
            return;
        }
        let newPageNum = this.state.pageNum + 1;
        document.getElementById("pageNum").value = newPageNum;
        window.location.hash = newPageNum;
        this.fetchChatList(this.state.id, newPageNum);
        this.setState({
            pageImg: `${serverURL}/api/slideImg?slideID=${this.state.id}&pageNum=${newPageNum}`,
            pageNum: newPageNum
        });
    }

    /**
     * Go to the previous page of slide, should fetch the url and the chat threads list of the new page 
     */
    prevPage() {
        if (this.state.pageNum < 2) {
            return;
        }
        let newPageNum = this.state.pageNum - 1;
        document.getElementById("pageNum").value = newPageNum;
        window.location.hash = newPageNum;
        this.fetchChatList(this.state.id, newPageNum);
        this.setState({
            pageImg: `${serverURL}/api/slideImg?slideID=${this.state.id}&pageNum=${newPageNum}`,
            pageNum: newPageNum
        });
    }

    gotoPage() {
        let newPageNum = +document.getElementById("pageNum").value;
        if (isNaN(newPageNum)) {
            document.getElementById("pageNum").value = this.state.pageNum;
            return;
        }
        if (newPageNum > this.state.pageTotal) {
            newPageNum = this.state.pageTotal;
        } else if (newPageNum < 1) {
            newPageNum = 1;
        }
        document.getElementById("pageNum").value = newPageNum;
        window.location.hash = newPageNum;
        this.fetchChatList(this.state.id, newPageNum);
        this.setState({
            pageImg: `${serverURL}/api/slideImg?slideID=${this.state.id}&pageNum=${newPageNum}`,
            pageNum: newPageNum
        });
    }

    render() {
        return (
            <div className="main">
                <Slides
                    pageNum={this.state.pageNum}
                    pageTotal={this.state.pageTotal}
                    pageImg={this.state.pageImg}
                    nextPage={this.nextPage}
                    prevPage={this.prevPage}
                    gotoPage={this.gotoPage} />
                <ChatArea
                    chats={this.state.questions}
                    slideID={this.state.id}
                    pageNum={this.state.pageNum}
                    fetchChatList={this.fetchChatList}
                    ref="chatArea" />
            </div>
        );
    }
}

export default Main;