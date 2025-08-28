@@ .. @@
               {output.map((line, index) => (
                 <motion.div
                   key={index}
                   initial={{ opacity: 0, y: 10 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ duration: 0.3, delay: index * 0.05 }}
               )
               )
               }
-                  className="flex items-start gap-2 py-1"
+                  className="flex items-start gap-2 py-1 border-b border-gray-800 last:border-b-0"
                 >
-                  <span className="text-gray-500 text-xs font-mono min-w-[3rem]">
+                  <span className="text-gray-500 text-xs font-mono min-w-[2rem] flex-shrink-0">
                     {String(index + 1).padStart(2, '0')}
                   </span>
-                  <span className="text-green-400 font-mono text-sm">
+                  <span className="text-green-400 font-mono text-sm flex-1">
                     {line}
                   </span>
+                  <span className="text-gray-600 text-xs flex-shrink-0">
+                    {new Date().toLocaleTimeString()}
+                  </span>
                 </motion.div>
               ))}
             </div>