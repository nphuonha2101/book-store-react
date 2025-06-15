import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, X, BookOpen, ShoppingBag, MessageSquare } from 'lucide-react';
import { API_ENDPOINTS } from '../../../constants/apiInfo';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { marked } from 'marked';
import { CHAT_TYPE } from '../../../constants/chatType';
import LogoSvg from '../../../assets/images/Logo.svg';

// Define types for our messages
interface Message {
    id: number;
    text: string|Promise<string>;
    sender: 'user' | 'bot';
    timestamp: Date;
}


// Define API response type
interface ChatApiResponse {
    success: boolean;
    message: string;
    statusCode: number;
    data: string;
    pagination: null;
}

export const Chatbox = () => {
    const [messages, setMessages] = useState<Message[]>(
        [
            {
                id: 1,
                text: "Xin chào! Tôi có thể giúp gì cho bạn?",
                sender: 'bot',
                timestamp: new Date()
            }
        ]
    );
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const [chatType, setChatType] = useState<string>(CHAT_TYPE.GENERAL);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const user = useSelector((state: RootState) => state.auth.user);
    const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
    const token = useSelector((state: RootState) => state.auth.token);

    // Use for fallback responses if API fails
    const botResponses: string[] = [
        "Tôi hiểu vấn đề của bạn. Để tôi suy nghĩ...",
        "Đó là một câu hỏi hay. Tôi nghĩ rằng...",
        "Cảm ơn bạn đã chia sẻ. Tôi có thể giúp thêm gì không?",
        "Tôi đánh giá cao sự quan tâm của bạn về điều này.",
        "Đây là góc nhìn của tôi về vấn đề này...",
        "Tôi hy vọng thông tin này hữu ích với bạn.",
        "Bạn có cần tôi giải thích thêm về điều gì không?",
        "Tôi sẵn sàng hỗ trợ bạn thêm.",
    ];

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (!isOpen && messages.length > 1) {
            const lastMessage = messages[messages.length - 1];
            if (lastMessage.sender === 'bot') {
                setUnreadCount(prev => prev + 1);
            }
        }
    }, [messages, isOpen]);

    useEffect(() => {
        if (isOpen) {
            setUnreadCount(0);
        }
    }, [isOpen]);

    // Update welcome message when chat type changes
    useEffect(() => {
        let welcomeMessage = "Xin chào! Tôi có thể giúp gì cho bạn?";

        if (chatType === 'book_search') {
            welcomeMessage = "Bạn muốn tìm kiếm sách nào? Vui lòng cung cấp tên sách, tác giả hoặc thể loại.";
        } else if (chatType === 'order_status') {
            welcomeMessage = "Vui lòng cung cấp mã đơn hàng hoặc thông tin liên hệ để kiểm tra trạng thái đơn hàng của bạn.";
        }

        // Only update if there's only the initial message or messages array is empty
        if (messages.length <= 1) {
            setMessages([{
                id: 1,
                text: welcomeMessage,
                sender: 'bot',
                timestamp: new Date()
            }]);
        }
    }, [chatType]);

    const getBotResponseFromApi = async (userMessage: string): Promise<string> => {
        try {
            const headers: Record<string, string> = {
                'Content-Type': 'application/json'
            }
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }
            const response = await fetch(API_ENDPOINTS.CHAT.SEND.URL, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify({
                    message: userMessage,
                    chatType: chatType
                }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data: ChatApiResponse = await response.json();

            if (data.success && data.data) {
                return data.data;
            } else {
                throw new Error('Invalid response from API');
            }
        } catch (error) {
            console.error('Error fetching bot response:', error);
            // Fallback to a random response if API fails
            return botResponses[Math.floor(Math.random() * botResponses.length)];
        }
    };

    const handleSendMessage = async () => {
        if (!inputValue.trim()) return;

        const userMessageText = inputValue.trim();

        const newMessage: Message = {
            id: Date.now(),
            text: userMessageText,
            sender: 'user',
            timestamp: new Date()
        };

        setMessages(prev => [...prev, newMessage]);
        setInputValue('');
        setIsTyping(true);

        try {
            const botResponse = await getBotResponseFromApi(userMessageText);
            const htmlMessage = marked.parse(botResponse, { gfm: true });

            const botMessage: Message = {
                id: Date.now() + 1,
                text: htmlMessage,
                sender: 'bot',
                timestamp: new Date()
            };

            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            console.error('Error in chat flow:', error);
            // Handle error by showing an error message to the user
            const errorMessage: Message = {
                id: Date.now() + 1,
                text: "Xin lỗi, có lỗi xảy ra. Vui lòng thử lại sau.",
                sender: 'bot',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const formatTime = (timestamp: Date): string => {
        return timestamp.toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Change chat type and reset messages
    const changeChatType = (type: string) => {
        if (type !== chatType) {
            setChatType(type);

            let welcomeMessage = "Xin chào! Tôi có thể giúp gì cho bạn?";

            if (type === CHAT_TYPE.BOOK_SEARCH) {
                welcomeMessage = "Bạn muốn tìm kiếm sách nào? Vui lòng cung cấp tên sách, tác giả hoặc thể loại.";
            } else if (type === CHAT_TYPE.ORDER_LOOKUP) {
                welcomeMessage = "Vui lòng cung cấp mã đơn hàng hoặc thông tin liên hệ để kiểm tra trạng thái đơn hàng của bạn.";
            }

            // Reset messages with new welcome message
            setMessages([
                {
                    id: Date.now(),
                    text: welcomeMessage,
                    sender: 'bot',
                    timestamp: new Date()
                }
            ]);
        }
    };

    // Chat toggle button
    if (!isOpen) {
        return (
            <div className="fixed bottom-32 right-4 z-50">
                <button
                    onClick={() => setIsOpen(true)}
                    className="flex items-center justify-center h-12 w-12 bg-primary rounded-full shadow-lg hover:bg-primary/90 transition-colors duration-200"
                    aria-label="Mở chat"
                >
                    <MessageSquare className="h-5 w-5 text-primary-foreground" />
                    {unreadCount > 0 && (
                        <div className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-destructive text-destructive-foreground text-xs flex items-center justify-center font-medium">
                            {unreadCount}
                        </div>
                    )}
                </button>
            </div>
        );
    }

    return (
        <div className="fixed bottom-32 right-4 z-50">
            <div className="bg-background/85 backdrop-blur-sm border border-border/50 rounded-lg shadow-lg w-96 transition-opacity duration-200">
                {/* Header */}
                <div className="flex items-center justify-between p-3 border-b border-border/40 bg-muted/30 backdrop-blur-sm rounded-t-lg">
                    <div className="flex items-center space-x-2">
                        <div className="h-8 w-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                            <img src={LogoSvg} alt="Logo" className="h-5 w-5" />
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-foreground">NPBookStore Assistant</h3>
                            <p className="text-xs text-muted-foreground">Trả lời trong vài giây</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-1">
                        <button
                            onClick={() => setIsOpen(false)}
                            className="h-7 w-7 rounded-md hover:bg-destructive/10 hover:text-destructive transition-colors flex items-center justify-center"
                            aria-label="Đóng chat"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                </div>

                {/* Messages */}
                <div className="h-[320px] overflow-y-auto p-3 space-y-3 bg-background/40 backdrop-blur-xs">
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`flex items-start space-x-2 max-w-[85%] ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                                }`}>
                                <div className={`h-6 w-6 rounded-full flex items-center justify-center flex-shrink-0 ${message.sender === 'user'
                                    ? 'bg-primary text-primary-foreground'
                                    : 'bg-muted text-muted-foreground'
                                    }`}>
                                    {message.sender === 'user'
                                        ? ((user && user.avatar)
                                            ? <img className='w-6 h-6 rounded-full' src={user.avatar} alt="User Avatar" />
                                            : <User className="h-3 w-3" />)
                                        : <img className='w-4 h-4 rounded-full' src={LogoSvg} alt="Bot Avatar" />}
                                </div>
                                <div>
                                    <div className={`px-3 py-2 rounded-lg text-sm ${message.sender === 'user'
                                        ? 'bg-primary text-primary-foreground'
                                        : 'bg-muted text-foreground'
                                        }`} dangerouslySetInnerHTML={{ __html: message.text }}>
                                    </div>
                                    <p className={`text-xs text-muted-foreground mt-1 ${message.sender === 'user' ? 'text-right' : 'text-left'
                                        }`}>
                                        {formatTime(message.timestamp)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Typing Indicator */}
                    {isTyping && (
                        <div className="flex justify-start">
                            <div className="flex items-start space-x-2">
                                <div className="h-6 w-6 bg-muted text-muted-foreground rounded-full flex items-center justify-center">
                                    <Bot className="h-3 w-3" />
                                </div>
                                <div className="bg-muted px-3 py-2 rounded-lg">
                                    <div className="flex space-x-1">
                                        <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce"></div>
                                        <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce [animation-delay:0.1s]"></div>
                                        <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce [animation-delay:0.2s]"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>
                {/* Input với Chat Type Selection */}
                <div className="p-3 border-t border-border/40 bg-background/60 backdrop-blur-sm rounded-b-lg">
                    <div className="mb-2 flex items-center justify-between px-1">
                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => changeChatType(CHAT_TYPE.GENERAL)}
                                className={`inline-flex items-center px-2 py-1 rounded-full text-xs transition-colors ${chatType === CHAT_TYPE.GENERAL
                                    ? 'bg-primary/80 text-primary-foreground'
                                    : 'bg-muted/50 hover:bg-muted/80 text-muted-foreground'
                                    }`}
                            >
                                <MessageSquare className="h-3 w-3 mr-1" />
                                <span>Trò chuyện</span>
                            </button>
                            <button
                                onClick={() => changeChatType(CHAT_TYPE.BOOK_SEARCH)}
                                className={`inline-flex items-center px-2 py-1 rounded-full text-xs transition-colors ${chatType === CHAT_TYPE.BOOK_SEARCH
                                    ? 'bg-primary/80 text-primary-foreground'
                                    : 'bg-muted/50 hover:bg-muted/80 text-muted-foreground'
                                    }`}
                            >
                                <BookOpen className="h-3 w-3 mr-1" />
                                <span>Sách</span>
                            </button>
                            {isAuthenticated && (
                                <button
                                    onClick={() => changeChatType(CHAT_TYPE.ORDER_LOOKUP)}
                                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs transition-colors ${chatType === CHAT_TYPE.ORDER_LOOKUP
                                        ? 'bg-primary/80 text-primary-foreground'
                                        : 'bg-muted/50 hover:bg-muted/80 text-muted-foreground'
                                        }`}
                                >
                                    <ShoppingBag className="h-3 w-3 mr-1" />
                                    <span>Đơn hàng</span>
                                </button>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder={
                                chatType === CHAT_TYPE.BOOK_SEARCH
                                    ? "Nhập tên sách hoặc tác giả..."
                                    : chatType === CHAT_TYPE.ORDER_LOOKUP
                                        ? "Nhập mã đơn hàng..."
                                        : "Nhập tin nhắn..."
                            }
                            className="flex-1 px-3 py-2 text-sm bg-background border border-input rounded-md focus:outline-none focus:ring-1 focus:ring-ring focus:border-transparent placeholder:text-muted-foreground"
                            maxLength={500}
                        />
                        <button
                            onClick={handleSendMessage}
                            disabled={!inputValue.trim() || isTyping}
                            className="h-9 w-9 bg-primary hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground text-primary-foreground rounded-md flex items-center justify-center transition-colors"
                        >
                            <Send className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
