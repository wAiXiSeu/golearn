-- Seed lessons
INSERT INTO lessons (id, title, description, category, difficulty, order_index, content) VALUES
('basics-1', '围棋简介', '了解围棋的基本概念和历史', 'basics', 1, 1, '{"type": "intro", "steps": [{"text": "围棋是一种策略性棋类游戏，起源于中国，已有数千年的历史。"}, {"text": "黑白双方轮流在棋盘上落子，目的是围占地盘。"}, {"text": "围棋是世界上最复杂的棋类游戏之一。"}]}'),
('basics-2', '棋盘与棋子', '认识棋盘结构和棋子', 'basics', 1, 2, '{"type": "board_intro", "steps": [{"text": "标准棋盘是19x19的网格，共361个交叉点。"}, {"text": "黑棋先行，双方轮流落子。"}, {"text": "棋盘上的星位用于定位和 handicap 设置。"}]}'),
('basics-3', '气的概念', '理解棋子生存的基本条件', 'basics', 2, 3, '{"type": "interactive", "steps": [{"text": "棋子的气是指与之直接相邻的空交叉点。"}, {"board": [[null,"black",null],[null,null,null]], "text": "这个黑子有3口气。"}]}'),
('basics-4', '提子', '学习如何吃掉对方的棋子', 'basics', 2, 4, '{"type": "interactive", "steps": [{"text": "当棋子的气被完全堵住时，就会被提走。"}]}'),
('basics-5', '禁着点', '理解不能落子的位置', 'basics', 2, 5, '{"type": "interactive", "steps": [{"text": "自杀规则：不能落在会让自己棋子被提的位置（除非同时提掉对方）。"}]}');

-- Seed puzzles
INSERT INTO puzzles (id, title, type, difficulty, board_size, description, initial_state, solution_tree, hint) VALUES
('puzzle-1', '吃子练习1', 'capture', 1, 9, '白棋只剩一口气，黑棋如何提子？', '{"black": [[4,4]], "white": [[5,4]]}', '{"move": {"x": 6, "y": 4}, "correct": true}', '找到白棋的最后一口气'),
('puzzle-2', '吃子练习2', 'capture', 1, 9, '两颗白棋只剩一口气', '{"black": [[3,3], [4,3]], "white": [[5,3], [5,4]]}', '{"move": {"x": 6, "y": 3}, "correct": true}', '观察白棋的连接'),
('puzzle-3', '逃跑练习', 'escape', 1, 9, '黑棋只剩一口气，如何逃跑？', '{"black": [[4,4]], "white": [[3,4], [5,4], [4,3]]}', '{"move": {"x": 4, "y": 5}, "correct": true}', '找到能增加气的方向'),
('puzzle-4', '征子入门', 'tesuji', 2, 9, '学习征子（扭羊头）', '{"black": [[2,2]], "white": [[3,3]]}', '{"move": {"x": 4, "y": 4}, "correct": true, "nextMoves": [{"move": {"x": 2, "y": 4}}]}', '连续追击直到边角'),
('puzzle-5', '做眼入门', 'life_death', 2, 9, '学习如何做眼存活', '{"black": [[3,3], [3,4], [4,3]], "white": []}', '{"move": {"x": 4, "y": 4}, "correct": true}', '围出两个空点');