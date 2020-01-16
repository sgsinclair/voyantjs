export const CorpusMetadata = {
	"version": "5.6",
	"voyantVersion": "2.4",
	"voyantBuild": "M29",
	"duration": 6,
	"corpus": {
		"metadata": {
			"id": "080469ce65fb3e40168914f4df21116e",
			"title": "",
			"subTitle": "",
			"documentsCount": 8,
			"createdTime": 1569424932613,
			"createdDate": "2019-09-25T11:22:12.613-0400",
			"lexicalTokensCount": 810710,
			"lexicalTypesCount": 15834,
			"noPasswordAccess": "NORMAL",
			"languageCodes": [
				"en"
			]
		}
	}
}

export const CorpusError = `A corpus was specified but does not exist, could not be migrated and could not be recreated: 080469ce65fb3e4168914f4df21116e
java.lang.IllegalArgumentException: A corpus was specified but does not exist, could not be migrated and could not be recreated: 080469ce65fb3e4168914f4df21116e
	at org.voyanttools.trombone.tool.corpus.CorpusManager.run(CorpusManager.java:94)
	at org.voyanttools.trombone.tool.corpus.CorpusManager.getCorpus(CorpusManager.java:108)
	at org.voyanttools.trombone.tool.corpus.AbstractCorpusTool.run(AbstractCorpusTool.java:33)
	at org.voyanttools.trombone.tool.util.ToolRunner.run(ToolRunner.java:134)
	at org.voyanttools.trombone.Controller.run(Controller.java:110)
	at org.voyanttools.voyant.Trombone.runTromboneController(Trombone.java:346)
	at org.voyanttools.voyant.Trombone.doRequest(Trombone.java:320)
	at org.voyanttools.voyant.Trombone.doRequest(Trombone.java:155)
	at org.voyanttools.voyant.Trombone.doGet(Trombone.java:89)
	at javax.servlet.http.HttpServlet.service(HttpServlet.java:624)
	at javax.servlet.http.HttpServlet.service(HttpServlet.java:731)
	at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:303)
	at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:208)
	at org.apache.tomcat.websocket.server.WsFilter.doFilter(WsFilter.java:52)
	at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:241)
	at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:208)
	at org.apache.catalina.core.StandardWrapperValve.invoke(StandardWrapperValve.java:219)
	at org.apache.catalina.core.StandardContextValve.invoke(StandardContextValve.java:110)
	at org.apache.catalina.authenticator.AuthenticatorBase.invoke(AuthenticatorBase.java:506)
	at org.apache.catalina.core.StandardHostValve.invoke(StandardHostValve.java:169)
	at org.apache.catalina.valves.ErrorReportValve.invoke(ErrorReportValve.java:103)
	at org.apache.catalina.valves.AccessLogValve.invoke(AccessLogValve.java:962)
	at org.apache.catalina.core.StandardEngineValve.invoke(StandardEngineValve.java:116)
	at org.apache.catalina.connector.CoyoteAdapter.service(CoyoteAdapter.java:445)
	at org.apache.coyote.http11.AbstractHttp11Processor.process(AbstractHttp11Processor.java:1115)
	at org.apache.coyote.AbstractProtocol$AbstractConnectionHandler.process(AbstractProtocol.java:637)
	at org.apache.tomcat.util.net.JIoEndpoint$SocketProcessor.run(JIoEndpoint.java:316)
	at java.util.concurrent.ThreadPoolExecutor.runWorker(ThreadPoolExecutor.java:1149)
	at java.util.concurrent.ThreadPoolExecutor$Worker.run(ThreadPoolExecutor.java:624)
	at org.apache.tomcat.util.threads.TaskThread$WrappingRunnable.run(TaskThread.java:61)
	at java.lang.Thread.run(Thread.java:748)
`
